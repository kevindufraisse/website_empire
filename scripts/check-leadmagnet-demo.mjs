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
 const mapped=selector==='[data-scroll-discovery="comparison"]'?{value:.40+progress*.32,phase:'comparison'}:selector==='#formula-lead-messages'?{value:.72+progress*.16,phase:'instagram'}:selector==='#formula-youtube'?{value:.88+progress*.12,phase:'long'}:null
 await page.locator(mapped?'[data-unified-formats]':selector).evaluate((el,p)=>{scrollTo({top:el.getBoundingClientRect().top+scrollY+p*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'})},mapped?mapped.value:progress)
 if(mapped)await page.waitForFunction(phase=>document.querySelector('[data-unified-formats]')?.getAttribute('data-journey-phase')===phase,mapped.phase)
 if(selector==='#formula-ideas')await page.waitForFunction(p=>{const i=Math.min(6,Math.floor(p*7)),root=document.querySelector('#formula-ideas');return root?.querySelector('[data-idea-example]')?.getAttribute('data-idea-example')===String(i)&&Number(getComputedStyle(root.querySelector(`[data-idea-layer="${i}"] [data-idea-reply]`)).opacity)>.99},progress)
 if(selector==='#formula-lead-messages')await page.waitForFunction(p=>{const root=document.querySelector('[data-journey-pane="instagram"]');return [['[data-scroll-reveal="comment"]',.12],['[data-scroll-reveal="reply"]',.29],['[data-lead-dm]',.54],['[data-lead-resource]',.78]].every(([q,n])=>{const v=Number(getComputedStyle(root.querySelector(q)).opacity);return p>=n?v>.99:v<.01})},progress)
 await page.waitForTimeout(450)
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
 for(const path of ['components/IdeaMessagesStory.tsx','components/LeadMagnetScene.tsx','components/LongFormatScroll.tsx','components/sections/QuickWinsSection.tsx']){
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
   const ideas=page.locator('#formula-ideas'),pair=page.locator('[data-lead-comparison]'),messages=page.locator('[data-journey-pane="instagram"]')
   assert.equal(await ideas.locator('button').count(),0,'The chat must never require previous/next buttons')
   assert.equal(await messages.locator('button').count(),0,'Messages must be discovered by scrolling')
   assert(await page.evaluate(()=>{const ids=['#formula-ideas','[data-story="formula"]','#formula-lead-magnet','#formula-youtube','#formula-secret'];return ids.slice(1).every((id,i)=>!!(document.querySelector(ids[i]).compareDocumentPosition(document.querySelector(id))&4))}),'Keep lead magnet before YouTube and the conditional form')
   assert((await ideas.locator('#ideas-title').innerText()).includes('partagez-la'))

   const travel=await ideas.evaluate(el=>el.offsetHeight-innerHeight)
   assert(travel/7>=viewport.height*1.15,'Each exchange needs at least 1.15 viewport heights of scrolling')
   for(let i=0;i<7;i++){
    await at(page,'#formula-ideas',(i+.55)/7)
    assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),String(i))
    const exchange=ideas.locator(`[data-idea-layer="${i}"]`)
    assert(await opacity(exchange.locator('[data-idea-reply]'))>.99,'Reply must stay readable through the hold')
    await fits(page,exchange.locator('[data-idea-outgoing]'),`${name} outgoing ${i}`)
    await fits(page,exchange.locator('[data-idea-reply]'),`${name} reply ${i}`)
    const heading=ideas.locator('#ideas-title')
    assert((await heading.innerText()).includes(i===6?'publient vos concurrents.':'partagez-la.'),'The competitor headline replaces the idea headline only during watch')
    const phone=await ideas.locator('[data-idea-example]').evaluate(el=>el.parentElement.getBoundingClientRect().toJSON())
    assert(phone.width<=280&&phone.width/phone.height<.60,'Keep the phone slim and portrait')
    if([3,4,5].includes(i)){const link=exchange.locator('[data-idea-source]');assert(await link.locator('svg').count()>0);assert((await link.innerText()).includes(['instagram.com/reel/','youtube.com/shorts/','linkedin.com/posts/'][i===3?0:i===4?1:2]))}
    if(i===6)assert((await exchange.innerText()).includes('tiktok.com/'))
    if([2,3,5,6].includes(i)){const preview=exchange.locator('[data-idea-source]');assert.equal(await preview.count(),1);await fits(page,preview,`${name} source preview ${i}`)}
    if([0,2,3,5,6].includes(i))await page.screenshot({path:`${out}/${name}-ideas-${i}.png`})
   }
   await at(page,'#formula-ideas',2.55/7)
   assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),'2')
   const y=await page.evaluate(()=>scrollY)
   await page.waitForTimeout(900)
   assert.equal(await ideas.locator('[data-idea-example]').getAttribute('data-idea-example'),'2','No time-based auto advance')
   assert(Math.abs(await page.evaluate(()=>scrollY)-y)<3,'No forced scroll')
   await page.mouse.wheel(0,180)
   await page.waitForFunction(y=>scrollY>y+100,y,{timeout:3000})
   await at(page,'[data-scroll-discovery="comparison"]',.02)
   assert(await opacity(pair.locator('[data-lead-clip="result"]'))>.99,'The translated clone must be fully visible from the start')
   await at(page,'[data-scroll-discovery="comparison"]',.55)
   const source=pair.locator('[data-lead-clip="source"]'),result=pair.locator('[data-lead-clip="result"]')
   assert.equal(await pair.locator('video').count(),2)
   const a=await source.boundingBox(),b=await result.boundingBox()
   assert(Math.abs(a.y-b.y)<3&&a.x+a.width<=b.x,'Both real edits must remain side by side')
   assert(await opacity(result)>.99)
   await fits(page,source,`${name} source`);await fits(page,result,`${name} result`)
   const va=await source.locator('video').boundingBox(),vb=await result.locator('video').boundingBox()
   assert(Math.abs(va.y-vb.y)<3&&Math.abs(va.height-vb.height)<3,'The two video windows must align')
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.readyState>=2&&v.videoHeight>v.videoWidth&&!v.paused),null,{timeout:15000})
   const times=await pair.locator('video').evaluateAll(vs=>vs.map(v=>v.currentTime))
   await page.waitForFunction(times=>[...document.querySelectorAll('[data-lead-comparison] video')].every((v,i)=>Math.abs(v.currentTime-times[i])>.1),times,{timeout:8000})
   await page.screenshot({path:`${out}/${name}-comparison.png`})
   await pair.getByRole('button',{name:'Mettre les deux vidéos en pause'}).click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.paused))
   assert(await pair.locator('video').evaluateAll(vs=>vs.every(v=>Number(v.dataset.start)===0&&v.duration>=14.9&&v.duration<=15.1)),'Both excerpts must contain the real opening fifteen seconds')
   await pair.locator('video').evaluateAll(vs=>vs.forEach(v=>{v.currentTime=13}))
   await pair.getByRole('button',{name:'Lire les deux vidéos'}).click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.currentTime>13.2&&v.currentTime<15),null,{timeout:5000})
   await pair.getByRole('button',{name:'Revoir les deux vidéos depuis le début'}).click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.currentTime<1&&!v.paused),null,{timeout:5000})
   assert((await pair.innerText()).includes('Même script traduit · français'))
   // Force a desynchronisation: the shared clock must recover it automatically.
   await pair.locator('video').nth(1).evaluate(v=>{v.currentTime=Math.min(12,v.currentTime+1)})
   await page.waitForFunction(()=>{const [a,b]=document.querySelectorAll('[data-lead-comparison] video');return !a.paused&&!b.paused&&!a.seeking&&!b.seeking&&Math.abs(a.currentTime-b.currentTime)<.16},null,{timeout:8000})
   await pair.getByRole('button',{name:'Mettre les deux vidéos en pause'}).click()
   await pair.locator('video').evaluateAll(vs=>vs.forEach(v=>{v.currentTime=9.3}))
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>!v.seeking&&v.paused&&Math.abs(v.currentTime-9.3)<.1))
   await page.screenshot({path:`${out}/${name}-translated-script-aligned.png`})
   await pair.locator('video').evaluateAll(vs=>vs.forEach(v=>{v.currentTime=14.8}))
   await pair.getByRole('button',{name:'Lire les deux vidéos'}).click()
   await page.waitForFunction(()=>[...document.querySelectorAll('[data-lead-comparison] video')].every(v=>v.currentTime<.8&&!v.paused),null,{timeout:8000})
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

   const long=page.locator('[data-journey-pane="long"]')
   await at(page,'#formula-youtube',.24)
   await fits(page,long.locator('[data-format-preview="long"]'),`${name} YouTube player`)
   const beforeLong=await long.locator('[data-format-preview="long"]').innerText()
   await at(page,'#formula-youtube',.80)
   const afterLong=await long.locator('[data-format-preview="long"]').innerText()
   assert.notEqual(beforeLong,afterLong,'YouTube timeline must advance with page scroll')
   assert.deepEqual(await page.locator('[data-unified-rail] [data-format-list] li span').allTextContents(),['Réaction','Tier list','FAQ','Devine','Clonage','Lead magnet','YouTube long'])
   assert.equal(await page.locator('[data-unified-rail] [data-format-list]').getAttribute('data-active-format'),'YouTube long')
   assert.equal(await page.locator('[data-unified-rail] [data-format-list] button').count(),0)
   if(viewport.width>1000) await fits(page,page.locator('[data-unified-rail] [data-format-list]'),`${name} seven-format rail`)
   await page.screenshot({path:`${out}/${name}-youtube-scroll.png`})
   await at(page,'#formula-youtube',.24)
   assert.equal(await long.locator('[data-format-preview="long"]').innerText(),beforeLong,'YouTube reverses with scroll')
   await at(page,'[data-story="team"]',.10)
   const team=page.locator('[data-story="team"]')
   assert.equal(await team.locator('[data-team-role]').count(),8)
   assert(await opacity(team.locator('[data-team-role]').first())>.99)
   await page.screenshot({path:`${out}/${name}-team-start.png`})
   await at(page,'[data-story="team"]',.86)
   assert(await opacity(team.locator('[data-team-role]').first())<.01)
   assert(await opacity(team.locator('[data-team-summary]'))>.99)
   await fits(page,team.locator('[data-team-core]'),`${name} Empire team core`)
   await fits(page,team.locator('[data-team-summary]'),`${name} team result`)
   await page.screenshot({path:`${out}/${name}-team-merged.png`})
   assert.equal(await page.locator('#home-comparison table').count(),0)
   assert((await page.locator('#home-comparison').innerText()).includes('Ce que vous faites'))
   assert((await page.locator('#empire-integrations').innerText()).includes('revenus attribués'))
   if(name==='desktop'||name==='mobile-small'){
    const compare=page.locator('#home-comparison')
    await compare.screenshot({path:`${out}/${name}-clear-comparison.png`})
    await at(page,'#empire-integrations',.90)
    await page.screenshot({path:`${out}/${name}-revenues.png`})
    await at(page,'#empire-community',.84)
    await page.screenshot({path:`${out}/${name}-community.png`})
    await at(page,'#formula-time',.06)
    await page.screenshot({path:`${out}/${name}-application.png`})
   }
   assert.deepEqual(errors,[])

   // The transition from Clone to lead magnet to YouTube shares one viewport.
   const shared=page.locator('[data-format-viewport]')
   let priorBox
   for(const [progress,phase] of [[.36,'short'],[.56,'comparison'],[.85,'instagram'],[.96,'long']]){
    await page.locator('[data-unified-formats]').evaluate((el,p)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+p*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'}),progress)
    await page.waitForFunction(phase=>document.querySelector('[data-unified-formats]')?.getAttribute('data-journey-phase')===phase,phase)
    await page.waitForTimeout(200)
    const box=await shared.boundingBox()
    if(priorBox)assert(Math.abs(box.y-priorBox.y)<2&&Math.abs(box.height-priorBox.height)<2,'The viewport must not unpin between formats')
    priorBox=box
   }
   const travelUnified=await page.locator('[data-unified-formats]').evaluate(el=>el.offsetHeight-innerHeight)
   assert(travelUnified*.32>viewport.height*3,'Lead comparison has more than three viewport heights of travel')
   await at(page,'[data-story="team"]',.86)
   assert.equal(await team.locator('[data-team-cost-total]').innerText(),'0 €')
   const distribution=page.locator('[data-story="distribution"]')
   const counter=page.locator('[data-distribution-total]')
   async function distributionAt(sequence){await distribution.evaluate((el,sequence)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(sequence-.568)/.432*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'}),sequence);await page.waitForTimeout(400)}
   await distributionAt(.810);assert.equal(await counter.getAttribute('data-total'),'280000')
   const counterNode=await counter.elementHandle()
   await distributionAt(.825);assert.equal(await counter.getAttribute('data-total'),'280000','Do not restart the total at the multi-account transition')
   await distributionAt(.902);await page.waitForFunction(()=>document.querySelector('[data-distribution-total]')?.getAttribute('data-total')==='529000',null,{timeout:5000});assert.equal(await counter.getAttribute('data-total'),'529000','280000 plus 249000 secondary views; never double count the 10000 original views')
   assert(await counterNode.evaluate(el=>el.isConnected),'Keep the same counter mounted')
   assert.equal(await counter.getAttribute('data-complete'),'true')
   await fits(page,counter,`${name} cumulative counter`)
   await page.screenshot({path:`${out}/${name}-cumulative-views.png`})
   await at(page,'#home-comparison',.65)
   const matrix=page.locator('#home-comparison')
   assert.equal(await matrix.locator('[data-comparison-axis]').count(),3)
   assert.deepEqual(await matrix.locator('[data-comparison-option]').evaluateAll(nodes=>nodes.map(n=>n.dataset.comparisonOption)),['tools','freelance','agency','empire'])
   assert.equal(await matrix.locator('[data-comparison-cell]').count(),12)
   assert.equal(await matrix.locator('[data-comparison-price]').getAttribute('data-comparison-price'),'199')
   if(viewport.width>900)for(const row of await matrix.locator('[data-comparison-axis]').all()){assert(await opacity(row)>.99);await fits(page,row,`${name} comparison row`)}
   await page.screenshot({path:`${out}/${name}-comparison-matrix.png`})

   reports.push({name,result:'passed',scrollDrivenChat:true,noNavigationArrows:true,readingHolds:true,instagramProgressiveReveal:true,bothClipsVisibleTogether:true,realPlayback:true,leadBeforeYouTube:true,youTubeScrollReversible:true,sevenFormatRail:true,teamConverges:true})
  }catch(error){await page.screenshot({path:`${out}/${name}-failure.png`}).catch(()=>{});reports.push({name,result:'failed',error:String(error),stack:error.stack,errors,media:await page.locator('[data-lead-comparison] video').evaluateAll(vs=>vs.map(v=>({time:v.currentTime,paused:v.paused,seeking:v.seeking,ready:v.readyState,ended:v.ended,buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)])}))).catch(()=>[])})}
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
 // Reduced motion intentionally renders the standalone static long section,
 // not a hidden pane of the unified animation.
 assert.equal(await page.locator('#formula-youtube').getAttribute('data-static'),'true')
 assert.equal(await page.locator('[data-unified-formats]').count(),0)
 assert.equal(await page.locator('[data-story="team"]').getAttribute('data-static'),'true')
 reports.push({name:'reduced-motion',result:'passed',allMessagesInNormalFlow:true});await context.close()
 assert.equal(reports.filter(r=>r.result==='failed').length,0,'Inspect scroll discovery screenshots and report')
}finally{
 await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await writeFile(`${out}/server.log`,log);console.log(JSON.stringify(reports,null,2))
 for(const browser of browsers)await browser.close()
 try{process.kill(-server.pid,'SIGTERM')}catch{}
}
