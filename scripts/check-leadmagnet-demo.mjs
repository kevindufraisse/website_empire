import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {chromium,webkit} from 'playwright'
const base='http://127.0.0.1:3101',out='artifacts/homepage/leadmagnet'
await mkdir(out,{recursive:true})
const server=spawn('npm',['run','dev','--','--hostname','127.0.0.1','--port','3101'],{stdio:['ignore','pipe','pipe'],detached:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}})
let log='';for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{log+=data.toString()})
const reports=[],browsers=[]
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function view(page,locator){
 await locator.evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-82,behavior:'instant'}))
 await page.waitForTimeout(300)
}
async function unclipped(locator,label){
 const state=await locator.evaluate(el=>{
  const r=el.getBoundingClientRect(),style=getComputedStyle(el)
  let parent=el.parentElement,clip=null
  while(parent){const s=getComputedStyle(parent),b=parent.getBoundingClientRect();if(['hidden','clip','auto','scroll'].includes(s.overflowY)&&(r.top<b.top-3||r.bottom>b.bottom+3)){clip={class:parent.className,child:r.bottom,parent:b.bottom};break}parent=parent.parentElement}
  return {width:r.width,height:r.height,opacity:style.opacity,visibility:style.visibility,display:style.display,clip}
 })
 assert(state.width>15&&state.height>15&&state.display!=='none'&&state.visibility!=='hidden',`${label}: hidden ${JSON.stringify(state)}`)
 assert(Number(state.opacity)>.95,`${label}: hidden by opacity`)
 assert.equal(state.clip,null,`${label}: cropped ${JSON.stringify(state.clip)}`)
}
try{
 for(let i=0;i<160;i++){try{if((await fetch(base)).ok)break}catch{}if(i===159)throw Error('Server not ready');await wait(750)}
 const c=await chromium.launch({channel:'chrome'}),w=await webkit.launch();browsers.push(c,w)
 const cases=[['desktop',{width:1440,height:1000},c],['laptop',{width:1280,height:720},c],['mobile',{width:390,height:844},c],['mobile-small',{width:375,height:667},c],['webkit-mobile',{width:390,height:844},w]]
 for(const [name,viewport,browser] of cases){
  const context=await browser.newContext({viewport,locale:'fr-FR'})
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort())
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message))
  try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000})
   const scene=page.locator('[data-scene="lead-magnet"]'),pair=scene.locator('[data-lead-comparison]'),dm=scene.locator('[data-lead-dm]'),comment=scene.locator('[data-lead-comment]')
   await scene.waitFor()
   const reject=page.getByRole('button',{name:/Tout refuser|Continuer sans accepter/i}).first();if(await reject.isVisible().catch(()=>false))await reject.click()
   assert.equal(await scene.evaluate(el=>!!el.closest('[data-viewport-stage]')),false,'Lead magnet must not be a pinned animation frame')
   assert.equal(await scene.evaluate(el=>getComputedStyle(el).position),'relative')
   assert(await scene.evaluate(el=>Boolean(el.compareDocumentPosition(document.getElementById('formula-youtube'))&Node.DOCUMENT_POSITION_FOLLOWING)),'Lead magnet must precede YouTube')
   assert(await page.locator('#formula-youtube').evaluate(el=>Boolean(el.compareDocumentPosition(document.getElementById('formula-secret'))&Node.DOCUMENT_POSITION_FOLLOWING)),'YouTube must precede the conditional CTA')
   await view(page,pair)
   const videos=pair.locator('video')
   assert.equal(await videos.count(),2,'The original and adaptation must be visible together')
   for(const role of ['source','result']){
    const video=pair.locator(`[data-lead-clip="${role}"] video`)
    assert((await video.getAttribute('src')).includes(`leadmagnet-${role}-20261104.mp4`))
    await page.waitForFunction(role=>{const video=document.querySelector(`[data-lead-clip="${role}"] video`);return video&&video.readyState>=2&&video.videoHeight>video.videoWidth},role,{timeout:15000})
    const before=await video.evaluate(v=>v.currentTime)
    await page.waitForFunction(({role,before})=>{const video=document.querySelector(`[data-lead-clip="${role}"] video`);return video&&!video.paused&&Math.abs(video.currentTime-before)>.1},{role,before},{timeout:8000})
    await unclipped(video,`${name} ${role} clip`)
   }
   const [left,right]=await Promise.all([videos.nth(0).boundingBox(),videos.nth(1).boundingBox()])
   assert(Math.abs(left.y-right.y)<3&&Math.abs(left.width-right.width)<3,'Comparison must use equal frames on one row, including mobile')
   assert(left.x>=-2&&right.x+right.width<=viewport.width+2,'Comparison overflows horizontally')
   await page.screenshot({path:`${out}/${name}-comparison.png`})
   await pair.getByRole('button',{name:'Mettre en pause',exact:true}).click()
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-lead-comparison] video')).every(v=>v.paused))
   assert.equal(await pair.getAttribute('data-comparison-paused'),'true')
   await pair.getByRole('button',{name:'Revoir les montages',exact:true}).click()
   assert.equal(await pair.getAttribute('data-comparison-paused'),'false')
   const dmNode=await dm.elementHandle(),commentNode=await comment.elementHandle()
   await view(page,scene.locator('[data-lead-messages]'))
   await unclipped(comment,`${name} comment`)
   await unclipped(dm.locator('[data-lead-resource]'),`${name} DM resource`)
   assert((await dm.innerText()).includes('CLAUDE'))
   assert((await dm.innerText()).includes('kevin.dufraisse'))
   assert.equal(await dm.locator('a,button').count(),0,'Illustrative resource must not be a fake live download')
   const scrollAreas=await dm.evaluate(el=>Array.from(el.querySelectorAll('*')).filter(n=>['auto','scroll'].includes(getComputedStyle(n).overflowY)&&n.scrollHeight>n.clientHeight+3).map(n=>n.className))
   assert.deepEqual(scrollAreas,[],`${name}: no nested message scrolling`)
   await view(page,dm)
   await page.screenshot({path:`${out}/${name}-messages.png`})
   // Overshoot rapidly, return, and resize. No message/input is tied to scroll progress.
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
   await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}))
   if(viewport.width<761){await page.setViewportSize({width:viewport.width,height:480});await page.setViewportSize(viewport)}
   await view(page,dm)
   assert(await dmNode.evaluate(el=>el.isConnected),'Fast scroll remounted the conversation')
   assert(await commentNode.evaluate(el=>el.isConnected),'Fast scroll remounted the comment')
   await unclipped(dm.locator('[data-lead-resource]'),`${name} resource after fast scroll`)
   await page.waitForTimeout(1800)
   assert.equal(await dm.locator('[data-lead-resource]').evaluate(el=>getComputedStyle(el).opacity),'1')
   assert((await scene.innerText()).includes('commentaire, message et ressource illustrés'))
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'Page overflows horizontally')
   assert.deepEqual(errors,[])
   reports.push({name,result:'passed',bothVideosDecode:true,equalSideBySideFrames:true,pauseReplay:true,leadBeforeYouTube:true,persistentMessagesAfterFastScroll:true,noNestedScroll:true})
  }catch(error){
   await page.screenshot({path:`${out}/${name}-failure.png`}).catch(()=>{})
   reports.push({name,result:'failed',error:String(error),errors})
  }finally{await context.close()}
 }
 const context=await c.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',locale:'fr-FR'})
 await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort())
 const page=await context.newPage();await page.goto(base,{waitUntil:'domcontentloaded'});const scene=page.locator('[data-scene="lead-magnet"][data-static="true"]');await scene.waitFor()
 assert.equal(await scene.locator('[data-lead-comparison] video').count(),0)
 assert.equal(await scene.locator('[data-lead-clip] img').count(),2)
 assert.equal(await scene.locator('[data-lead-dm]').isVisible(),true)
 assert.equal(await scene.locator('[data-lead-comment]').isVisible(),true)
 reports.push({name:'reduced-motion',result:'passed',bothPostersAndMessagesPresent:true});await context.close()
 const provenance=JSON.parse(await readFile('public/demo/leadmagnet-pair-20261104.json','utf8'))
 assert.equal(provenance.keyword,'CLAUDE')
 assert.equal(reports.filter(report=>report.result==='failed').length,0,'One or more native journey checks failed; inspect screenshots and report')
}finally{
 await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await writeFile(`${out}/server.log`,log)
 console.log(JSON.stringify(reports,null,2))
 for(const browser of browsers)await browser.close()
 try{process.kill(-server.pid,'SIGTERM')}catch{}
}
