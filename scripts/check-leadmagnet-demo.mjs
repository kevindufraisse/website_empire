import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {mkdir,writeFile} from 'node:fs/promises'
import {chromium,webkit} from 'playwright'

const base='http://127.0.0.1:3101',out='artifacts/homepage/leadmagnet'
await mkdir(out,{recursive:true})
const server=spawn('npm',['run','dev','--','--hostname','127.0.0.1','--port','3101'],{stdio:['ignore','pipe','pipe'],detached:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}})
let log='';for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{log+=data.toString()})
const reports=[],browsers=[]
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function place(locator){await locator.evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await locator.page().waitForTimeout(300)}
async function fitsWidth(page,locator,label){const box=await locator.boundingBox();assert(box&&box.width>20&&box.height>20,`${label}: missing`);assert(box.x>=-2&&box.x+box.width<=page.viewportSize().width+2,`${label}: width overflow ${JSON.stringify(box)}`)}
async function createContext(browser,viewport,reducedMotion='no-preference'){
 const context=await browser.newContext({viewport,locale:'fr-FR',reducedMotion})
 await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort())
 return context
}
try{
 for(let i=0;i<160;i++){try{if((await fetch(base)).ok)break}catch{}if(i===159)throw Error('Server not ready');await delay(750)}
 const chrome=await chromium.launch({channel:'chrome'}),safari=await webkit.launch();browsers.push(chrome,safari)
 for(const [name,viewport,browser] of [['desktop',{width:1440,height:1000},chrome],['laptop',{width:1280,height:720},chrome],['mobile',{width:390,height:844},chrome],['mobile-small',{width:375,height:667},chrome],['webkit-mobile',{width:390,height:844},safari]]){
  const context=await createContext(browser,viewport),page=await context.newPage(),errors=[]
  page.on('pageerror',error=>errors.push(error.message))
  try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('#formula-ideas').waitFor()
   const reject=page.getByRole('button',{name:/Tout refuser|Continuer sans accepter/i}).first();if(await reject.isVisible().catch(()=>false))await reject.click()
   const ideas=page.locator('#formula-ideas'),scene=page.locator('#formula-lead-magnet'),messages=page.locator('#formula-lead-messages'),long=page.locator('#formula-youtube')
   assert(await page.evaluate(()=>{const a=document.querySelector('#formula-ideas'),b=document.querySelector('[data-story="formula"]'),c=document.querySelector('#formula-lead-magnet'),d=document.querySelector('#formula-youtube');return !!(a.compareDocumentPosition(b)&4)&&!!(b.compareDocumentPosition(c)&4)&&!!(c.compareDocumentPosition(d)&4)}),'Order must be messages, short formats, lead magnet, YouTube')
   for(const locator of [ideas,scene,messages]){assert.equal(await locator.evaluate(el=>!!el.closest('[data-viewport-stage]')),false);assert.equal(await locator.evaluate(el=>getComputedStyle(el).position),'relative')}
   await place(ideas);await page.screenshot({path:`${out}/${name}-ideas.png`})
   const next=ideas.getByRole('button',{name:'Message suivant'}),previous=ideas.getByRole('button',{name:'Message précédent'})
   await next.click();await next.click();const selected=await ideas.locator('[data-idea-example]').getAttribute('data-idea-example');assert.equal(selected,'2')
   await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await place(ideas)
   assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),selected,'Fast scrolling must not advance the chat')
   await previous.click();assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),'1')
   await place(scene)
   const pair=scene.locator('[data-lead-comparison]'),source=pair.locator('[data-lead-clip="source"]'),result=pair.locator('[data-lead-clip="result"]')
   assert.equal(await pair.locator('video').count(),2,'Both real edits must be present together')
   await fitsWidth(page,source,`${name} source`);await fitsWidth(page,result,`${name} result`)
   const a=await source.boundingBox(),b=await result.boundingBox();assert(Math.abs(a.y-b.y)<3,'Both edits must be on the same row, including mobile');assert(a.x+a.width<=b.x,'Clips must not overlap')
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.readyState>=2&&v.videoHeight>v.videoWidth&&!v.paused),null,{timeout:15000})
   const times=await pair.locator('video').evaluateAll(vs=>vs.map(v=>v.currentTime))
   await page.waitForFunction(times=>[...document.querySelectorAll('[data-lead-comparison] video')].every((v,i)=>Math.abs(v.currentTime-times[i])>.1),times,{timeout:8000})
   await page.screenshot({path:`${out}/${name}-comparison.png`})
   const pause=pair.getByRole('button',{name:'Mettre les deux vidéos en pause'});await pause.click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.paused))
   const y=await page.evaluate(()=>scrollY);await pair.getByRole('button',{name:'Lire les deux vidéos'}).click();assert(Math.abs(await page.evaluate(()=>scrollY)-y)<3,'Playback controls must not move the page')
   await place(messages);await page.screenshot({path:`${out}/${name}-messages.png`})
   const comment=messages.locator('[data-lead-comment]'),dm=messages.locator('[data-lead-dm]')
   assert.equal(await comment.isVisible(),true);assert.equal(await dm.isVisible(),true)
   assert((await comment.innerText()).includes('CLAUDE'));assert((await dm.innerText()).includes('CLAUDE'))
   const original=await dm.elementHandle();await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await place(long);await place(messages)
   assert(await original.evaluate(el=>el.isConnected),'Scroll must not remount the DM')
   assert.equal(await dm.locator('[data-lead-resource]').evaluate(el=>getComputedStyle(el).opacity),'1')
   await place(dm);await page.screenshot({path:`${out}/${name}-dm.png`});await fitsWidth(page,dm,`${name} DM`)
   assert.deepEqual(await dm.evaluate(el=>[...el.querySelectorAll('*')].filter(n=>['auto','scroll'].includes(getComputedStyle(n).overflowY)&&n.scrollHeight>n.clientHeight+3).map(n=>n.className)),[],'Messages must not require nested scrolling')
   assert.equal(await dm.locator('button,a').count(),0,'Illustrative resource must not imply a real download')
   if(viewport.width<761){await page.setViewportSize({width:viewport.width,height:480});assert(await original.evaluate(el=>el.isConnected));assert.equal(await dm.isVisible(),true);await page.setViewportSize(viewport)}
   await place(long);await page.screenshot({path:`${out}/${name}-long.png`})
   assert(await long.locator('[data-format-preview="long"]').isVisible())
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'No horizontal page overflow')
   assert.deepEqual(errors,[])
   reports.push({name,result:'passed',bothClipsVisibleTogether:true,realPlayback:true,messagesPersistent:true,chatManual:true,leadBeforeYouTube:true})
  }catch(error){await page.screenshot({path:`${out}/${name}-failure.png`}).catch(()=>{});reports.push({name,result:'failed',error:String(error),errors})}
  finally{await context.close()}
 }
 const context=await createContext(chrome,{width:390,height:844},'reduce'),page=await context.newPage()
 await page.goto(base,{waitUntil:'domcontentloaded'});await page.locator('[data-story="accessible"]').waitFor()
 assert.equal(await page.locator('[data-lead-comparison] video').count(),0)
 assert.equal(await page.locator('[data-lead-clip]').count(),2)
 assert.equal(await page.locator('[data-lead-dm]').isVisible(),true)
 reports.push({name:'reduced-motion',result:'passed',comparisonAndMessagesPresent:true});await context.close()
 assert.equal(reports.filter(r=>r.result==='failed').length,0,'Inspect native journey screenshots and report')
}finally{
 await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await writeFile(`${out}/server.log`,log);console.log(JSON.stringify(reports,null,2))
 for(const browser of browsers)await browser.close()
 try{process.kill(-server.pid,'SIGTERM')}catch{}
}
