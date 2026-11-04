import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {mkdir,writeFile,readFile} from 'node:fs/promises'
import {chromium,webkit} from 'playwright'
const base='http://127.0.0.1:3101', out='artifacts/homepage/leadmagnet'
await mkdir(out,{recursive:true})
const server=spawn('npm',['run','dev','--','--hostname','127.0.0.1','--port','3101'],{stdio:['ignore','pipe','pipe'],detached:true,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}})
let log='';for(const stream of [server.stdout,server.stderr])stream.on('data',data=>{log+=data.toString()})
const reports=[],browsers=[]
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function locate(page,t){
 await page.evaluate(t=>{const el=document.querySelector('[data-story="formula"]');const raw=t<=.28?t/.28*.37:.37+(t-.28)/.418*.63;scrollTo({top:el.getBoundingClientRect().top+scrollY+raw*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'})},t)
 await page.waitForTimeout(450)
}
async function fits(page,locator,label){
 const box=await locator.boundingBox(),v=page.viewportSize()
 assert(box&&box.width>10&&box.height>10,`${label}: no visible box`)
 assert(box.x>=-2&&box.x+box.width<=v.width+2,`${label}: horizontal bounds ${JSON.stringify(box)}`)
 assert(box.y>=60&&box.y+box.height<=v.height+2,`${label}: vertical bounds ${JSON.stringify(box)}`)
 const clipped=await locator.evaluate(el=>{const r=el.getBoundingClientRect();let p=el.parentElement;while(p){const s=getComputedStyle(p),b=p.getBoundingClientRect();if(['hidden','clip','auto','scroll'].includes(s.overflowY)&&(r.top<b.top-2||r.bottom>b.bottom+2))return {class:p.className,childBottom:r.bottom,parentBottom:b.bottom};p=p.parentElement}return null})
 assert.equal(clipped,null,`${label}: ancestor clips content ${JSON.stringify(clipped)}`)
}
try{
 for(let i=0;i<160;i++){try{if((await fetch(base)).ok)break}catch{}if(i===159)throw Error('Server not ready');await wait(750)}
 // H.264 playback needs branded Chrome, not a Chromium build without proprietary codecs.
 // Geometry/form regression checks still run on bundled Chromium in the other script.
 const c=await chromium.launch({channel:'chrome'}),w=await webkit.launch();browsers.push(c,w)
 for(const [name,viewport,browser] of [['desktop',{width:1440,height:1000},c],['laptop',{width:1280,height:720},c],['mobile',{width:390,height:844},c],['mobile-small',{width:375,height:667},c],['webkit-mobile',{width:390,height:844},w]]){
  const context=await browser.newContext({viewport,locale:'fr-FR'})
  await context.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort())
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message))
  try{
   await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000});await page.locator('[data-story="formula"]').waitFor()
   const reject=page.getByRole('button',{name:/Tout refuser|Continuer sans accepter/i}).first();if(await reject.isVisible().catch(()=>false))await reject.click()
   await locate(page,.643)
   const scene=page.locator('[data-scene="lead-magnet"]'),video=scene.locator('video')
   assert((await video.getAttribute('src')).includes('kevin-leadmagnet-claude-20261023.mp4'),'Must use the inspected original video')
   await page.waitForFunction(()=>{const v=document.querySelector('[data-scene="lead-magnet"] video');return v&&v.readyState>=2&&v.videoHeight>v.videoWidth},null,{timeout:12000})
   const before=await video.evaluate(v=>v.currentTime)
   // Asynchronous playback may start later on a shared Linux WebKit runner.
   // Keep a real decoding assertion, with polling, rather than accepting a poster.
   await page.waitForFunction(before=>{const v=document.querySelector('[data-scene="lead-magnet"] video');return v&&!v.paused&&v.currentTime>before+.1},before,{timeout:8000})
   await fits(page,video,`${name} original video`)
   assert.equal(await scene.getAttribute('data-lead-step'),'0')
   await page.screenshot({path:`${out}/${name}-montage.png`})
   await locate(page,.659)
   assert.equal(await scene.getAttribute('data-lead-step'),'1')
   assert((await scene.locator('[data-lead-comment]').first().innerText()).includes('CLAUDE'))
   await page.screenshot({path:`${out}/${name}-comment.png`})
   await locate(page,.681)
   assert.equal(await scene.getAttribute('data-lead-step'),'2')
   const dm=scene.locator('[data-lead-dm]')
   await page.screenshot({path:`${out}/${name}-dm.png`})
   await fits(page,dm,`${name} Instagram DM`)
   await fits(page,dm.locator('[data-lead-resource]'),`${name} resource card`)
   await fits(page,dm.getByText('Réponse envoyée automatiquement'),`${name} auto-response label`)
   assert((await dm.innerText()).includes('kevin.dufraisse'))
   assert((await scene.innerText()).includes('commentaire, message et ressource illustrés'))
   const scrollAreas=await dm.evaluate(el=>Array.from(el.querySelectorAll('*')).filter(n=>['auto','scroll'].includes(getComputedStyle(n).overflowY)&&n.scrollHeight>n.clientHeight+3).map(n=>({class:n.className,overflow:n.scrollHeight-n.clientHeight})))
   assert.deepEqual(scrollAreas,[],`${name}: no nested scrolling in the demo`)
   const y=await page.evaluate(()=>scrollY)
   await scene.getByRole('button',{name:'Montage IA',exact:true}).click()
   assert.equal(await scene.getAttribute('data-lead-step'),'0')
   await fits(page,video,`${name} replayed video`)
   assert(Math.abs(await page.evaluate(()=>scrollY)-y)<3,'Step buttons must not scroll the page')
   await scene.getByRole('button',{name:'Message privé',exact:true}).click()
   assert.equal(await scene.getAttribute('data-lead-step'),'2')
   assert.equal(await dm.locator('a,button').count(),0,'Illustrative resource is not a fake live download')
   assert.deepEqual(errors,[])
   reports.push({name,result:'passed',browser:name.startsWith('webkit')?'WebKit Linux':'Google Chrome',originalVideoPlayback:true,manualNavigation:true,dmFits:true,noNestedScroll:true})
  }catch(e){
   await page.screenshot({path:`${out}/${name}-failure.png`}).catch(()=>{})
   const media=await page.locator('[data-scene="lead-magnet"] video').evaluateAll(videos=>videos.map(v=>({src:v.currentSrc,readyState:v.readyState,paused:v.paused,time:v.currentTime,error:v.error?.message,support:v.canPlayType('video/mp4; codecs="avc1.42E01E"'),width:v.videoWidth,height:v.videoHeight}))).catch(()=>[])
   reports.push({name,result:'failed',error:String(e),errors,media})
  }finally{await context.close()}
 }
 const context=await c.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',locale:'fr-FR'})
 await context.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort())
 const page=await context.newPage();await page.goto(base,{waitUntil:'domcontentloaded'});const scene=page.locator('[data-scene="lead-magnet"][data-static="true"]');await scene.waitFor()
 assert.equal(await scene.locator('video').count(),0)
 assert.equal(await scene.locator('[data-lead-reel]').isVisible(),true)
 assert.equal(await scene.locator('[data-lead-dm]').isVisible(),true)
 reports.push({name:'reduced-motion',result:'passed',bothStagesPresent:true});await context.close()
 const provenance=JSON.parse(await readFile('public/demo/kevin-leadmagnet-claude-20261023.json','utf8'))
 assert.equal(provenance.username,'kevin.dufraisse');assert.equal(provenance.excerpt_duration_seconds,20)
 assert.equal(reports.filter(r=>r.result==='failed').length,0,'One or more viewport checks failed; inspect screenshots and report')
}finally{
 await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));await writeFile(`${out}/server.log`,log)
 console.log(JSON.stringify(reports,null,2))
 for(const browser of browsers)await browser.close()
 try{process.kill(-server.pid,'SIGTERM')}catch{}
}
