import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {chromium,webkit} from 'playwright'

const base='http://127.0.0.1:3101',out='artifacts/homepage/leadmagnet'
await mkdir(out,{recursive:true})
const server=spawn('npm',['run','dev','--','--hostname','127.0.0.1','--port','3101'],{stdio:['ignore','pipe','pipe'],detached:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}})
let log='';for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{log+=data.toString()})
const reports=[],browsers=[]
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function at(page,selector,progress){
 await page.locator(selector).evaluate((el,p)=>{
  const top=el.getBoundingClientRect().top+scrollY
  scrollTo({top:top+p*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'})
 },progress)
 // WebKit on shared runners can paint the preceding React frame after scrollTo.
 // Poll for the exact intended state rather than accepting it after a fixed delay.
 await page.waitForFunction(({selector,progress})=>{
  const root=document.querySelector(selector)
  const visible=(query,wanted)=>{const node=root?.querySelector(query);if(!node)return false;const value=Number(getComputedStyle(node).opacity);return wanted?value>.99:value<.01}
  if(selector==='#formula-ideas'){
   const index=Math.min(6,Math.floor(progress*7))
   return root?.querySelector('[data-idea-example]')?.getAttribute('data-idea-example')===String(index)&&visible(`[data-idea-layer="${index}"] [data-idea-reply]`,true)
  }
  if(selector==='#formula-lead-messages')return visible('[data-scroll-reveal="comment"]',progress>=.12)&&visible('[data-scroll-reveal="reply"]',progress>=.29)&&visible('[data-lead-dm]',progress>=.54)&&visible('[data-lead-resource]',progress>=.78)
  return visible('[data-lead-clip="result"]',true)
 },{selector,progress},{timeout:5000})
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))
}
async function fits(page,locator,label){
 const box=await locator.boundingBox(),v=page.viewportSize()
 assert(box&&box.width>10&&box.height>10,`${label}: collapsed`)
 assert(box.x>=-2&&box.x+box.width<=v.width+2,`${label}: horizontal overflow ${JSON.stringify(box)}`)
 assert(box.y>=60&&box.y+box.height<=v.height+2,`${label}: outside viewport ${JSON.stringify(box)}`)
 const clipped=await locator.evaluate(el=>{const r=el.getBoundingClientRect();let p=el.parentElement;while(p){const s=getComputedStyle(p),b=p.getBoundingClientRect();if(['hidden','clip','auto','scroll'].includes(s.overflowY)&&(r.top<b.top-2||r.bottom>b.bottom+2))return p.className;p=p.parentElement}return null})
 assert.equal(clipped,null,`${label}: clipped by ${clipped}`)
}
async function opacity(locator){return locator.evaluate(el=>Number(getComputedStyle(el).opacity))}
async function contextFor(browser,viewport,reducedMotion='no-preference'){
 const context=await browser.newContext({viewport,locale:'fr-FR',reducedMotion})
 await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort())
 return context
}
try{
 // Native scrolling only: ensure no interception or scheduled scene navigation was introduced.
 for(const path of ['components/IdeaMessagesStory.tsx','components/LeadMagnetScene.tsx']){
  const source=await readFile(path,'utf8')
  assert(!/preventDefault|setTimeout|setInterval|scrollIntoView|scrollTo\(/.test(source),`${path}: no forced navigation`)
 }
 for(let i=0;i<160;i++){try{if((await fetch(base)).ok)break}catch{}if(i===159)throw Error('Server not ready');await delay(750)}
 const chrome=await chromium.launch({channel:'chrome'}),safari=await webkit.launch();browsers.push(chrome,safari)
 for(const [name,viewport,browser] of [['desktop',{width:1440,height:1000},chrome],['laptop',{width:1280,height:720},chrome],['mobile',{width:390,height:844},chrome],['mobile-small',{width:375,height:667},chrome],['webkit-mobile',{width:390,height:844},safari]]){
  const context=await contextFor(browser,viewport),page=await context.newPage(),errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('#formula-secret[data-requested="false"]').waitFor({state:'attached'})
   const reject=page.getByRole('button',{name:/Tout refuser|Continuer sans accepter/i}).first();if(await reject.isVisible().catch(()=>false))await reject.click()
   const ideas=page.locator('#formula-ideas'),pair=page.locator('[data-lead-comparison]'),messages=page.locator('#formula-lead-messages')
   assert.equal(await ideas.locator('button').count(),0,'The chat must never require previous/next buttons')
   assert.equal(await messages.locator('button').count(),0,'Messages must be discovered by scrolling')
   assert(await page.evaluate(()=>{const ids=['#formula-ideas','[data-story="formula"]','#formula-lead-magnet','#formula-youtube','#formula-secret'];return ids.slice(1).every((id,i)=>!!(document.querySelector(ids[i]).compareDocumentPosition(document.querySelector(id))&4))}),'Keep lead magnet before YouTube and the conditional form')
   const travel=await ideas.evaluate(el=>el.offsetHeight-innerHeight)
   assert(travel/7>=viewport.height*1.15,'Each exchange needs at least 1.15 viewport heights of scrolling')
   for(let i=0;i<7;i++){
    await at(page,'#formula-ideas',(i+.55)/7)
    assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),String(i))
    const exchange=ideas.locator(`[data-idea-layer="${i}"]`)
    assert(await opacity(exchange.locator('[data-idea-reply]'))>.99,'Reply must stay readable through the hold')
    await fits(page,exchange.locator('[data-idea-outgoing]'),`${name} outgoing ${i}`)
    await fits(page,exchange.locator('[data-idea-reply]'),`${name} reply ${i}`)
    if(i===0||i===3||i===6)await page.screenshot({path:`${out}/${name}-ideas-${i}.png`})
   }
   // Backward scroll must restore the preceding message, without clicking anything.
   await at(page,'#formula-ideas',2.55/7)
   assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),'2')
   const y=await page.evaluate(()=>scrollY)
   await page.waitForTimeout(900)
   assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),'2','No time-based auto advance')
   assert(Math.abs(await page.evaluate(()=>scrollY)-y)<3,'No forced scroll')
   await page.mouse.wheel(0,180)
   await page.waitForFunction(y=>scrollY>y+100,y,{timeout:3000})
   await at(page,'[data-scroll-discovery="comparison"]',.55)
   const source=pair.locator('[data-lead-clip="source"]'),result=pair.locator('[data-lead-clip="result"]')
   assert.equal(await pair.locator('video').count(),2)
   const a=await source.boundingBox(),b=await result.boundingBox()
   assert(Math.abs(a.y-b.y)<3&&a.x+a.width<=b.x,'Both real edits must remain side by side')
   assert(await opacity(result)>.99)
   await fits(page,source,`${name} source`);await fits(page,result,`${name} result`)
   const va=await source.locator('video').boundingBox(),vb=await result.locator('video').boundingBox()
   assert(Math.abs(va.y-vb.y)<3&&Math.abs(va.height-vb.height)<3,'The two video windows must align, not just their figures')
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.readyState>=2&&v.videoHeight>v.videoWidth&&!v.paused),null,{timeout:15000})
   const times=await pair.locator('video').evaluateAll(vs=>vs.map(v=>v.currentTime))
   await page.waitForFunction(times=>[...document.querySelectorAll('[data-lead-comparison] video')].every((v,i)=>Math.abs(v.currentTime-times[i])>.1),times,{timeout:8000})
   await page.screenshot({path:`${out}/${name}-comparison.png`})
   await pair.getByRole('button',{name:'Mettre les deux vidéos en pause'}).click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.paused))
   await pair.getByRole('button',{name:'Lire les deux vidéos'}).click()
   await at(page,'#formula-lead-messages',.17)
   assert(await opacity(messages.locator('[data-scroll-reveal="comment"]'))>.99)
   assert(await opacity(messages.locator('[data-scroll-reveal="reply"]'))<.01)
   assert(await opacity(messages.locator('[data-lead-dm]'))<.01)
   await at(page,'#formula-lead-messages',.36)
   assert(await opacity(messages.locator('[data-scroll-reveal="reply"]'))>.99)
   await fits(page,messages.locator('[data-lead-comment]'),`${name} comment`)
   await page.screenshot({path:`${out}/${name}-comment.png`})
   await at(page,'#formula-lead-messages',.90)
   const dm=messages.locator('[data-lead-dm]'),resource=dm.locator('[data-lead-resource]')
   assert(await opacity(dm)>.99&&await opacity(resource)>.99)
   await fits(page,dm,`${name} DM`);await fits(page,resource,`${name} resource`)
   assert((await dm.innerText()).includes('CLAUDE'))
   await page.screenshot({path:`${out}/${name}-dm.png`})
   assert.deepEqual(await dm.evaluate(el=>[...el.querySelectorAll('*')].filter(n=>['auto','scroll'].includes(getComputedStyle(n).overflowY)&&n.scrollHeight>n.clientHeight+3).map(n=>n.className)),[],'No inner message scrollbar')
   await at(page,'#formula-lead-messages',.98)
   assert(await opacity(resource)>.99,'Last frame holds until the section ends')
   await at(page,'#formula-lead-messages',.17)
   assert(await opacity(resource)<.01,'Reverse scroll replays the sequence')
   await at(page,'#formula-lead-messages',.90)
   assert(await opacity(resource)>.99,'Fast forward still renders the correct final result')
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'No horizontal overflow')
   assert.deepEqual(errors,[])
   reports.push({name,result:'passed',scrollDrivenChat:true,noNavigationArrows:true,readingHolds:true,instagramProgressiveReveal:true,bothClipsVisibleTogether:true,realPlayback:true,leadBeforeYouTube:true})
  }catch(error){await page.screenshot({path:`${out}/${name}-failure.png`}).catch(()=>{});reports.push({name,result:'failed',error:String(error),stack:error.stack,errors})}
  finally{await context.close()}
 }
 const context=await contextFor(chrome,{width:390,height:844},'reduce'),page=await context.newPage()
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('[data-story="accessible"]').waitFor()
 assert.equal(await page.locator('#formula-ideas button').count(),0)
 assert.equal(await page.locator('[data-idea-layer][aria-hidden="false"]').count(),7)
 assert.equal(await page.locator('[data-lead-comparison] video').count(),0)
 assert.equal(await page.locator('[data-lead-clip]').count(),2)
 assert.equal(await opacity(page.locator('[data-lead-resource]')),1)
 assert.equal(await page.locator('#formula-ideas>[data-scroll-stage]').evaluate(el=>getComputedStyle(el).position),'relative')
 reports.push({name:'reduced-motion',result:'passed',allMessagesInNormalFlow:true});await context.close()
 assert.equal(reports.filter(r=>r.result==='failed').length,0,'Inspect scroll discovery screenshots and report')
}finally{
 await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await writeFile(`${out}/server.log`,log);console.log(JSON.stringify(reports,null,2))
 for(const browser of browsers)await browser.close()
 try{process.kill(-server.pid,'SIGTERM')}catch{}
}
