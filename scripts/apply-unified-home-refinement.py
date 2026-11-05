from pathlib import Path
import re

def edit(path, transform):
    p=Path(path); old=p.read_text(); new=transform(old)
    assert new!=old, f'No change: {path}'
    p.write_text('\n'.join(line.rstrip() for line in new.splitlines())+'\n')
def once(text, old, new):
    assert text.count(old)==1, f'Expected one occurrence: {old[:100]}'
    return text.replace(old,new,1)

def formula(t):
    t=once(t,"import SecretFormatsGate from './SecretFormatsGate'", "import SecretFormatsGate from './SecretFormatsGate'\nimport UnifiedFormatJourney from './UnifiedFormatJourney'\nimport DistributionCounter, { NETWORK_VIEWS } from './DistributionCounter'\nimport metrics from './DistributionCounter.module.css'")
    t=once(t,'const VIEWS = [10000, 50000, 53000, 150000, 3000, 6000, 8000]','const VIEWS = NETWORK_VIEWS')
    start=t.index('function CreationStory() {'); end=t.index('\nfunction DistributionStory()',start)
    t=t[:start]+'''function CreationStory() {
  return <UnifiedFormatJourney renderShort={(p, timeline, kind, active) => <Formats p={p} cloneP={timeline} kind={kind} active={active}/>}/>
}
'''+t[end:]
    t=once(t,'<IdeaMessagesStory/><CreationStory/><LeadMagnetScene/><LongFormatScroll/><SecretFormatsGate/>','<IdeaMessagesStory/><CreationStory/><SecretFormatsGate/>')
    t,n=re.subn(r'^    <motion.div className=\{s\.reachTotal\}.*?</motion.div>\n','',t,flags=re.M);assert n==1
    t,n=re.subn(r'^    <small className=\{s\.simulation\}.*?</small>\n','',t,flags=re.M);assert n==1
    t=once(t,'${stable.distribution}`}','${stable.distribution} ${metrics.distribution}`}')
    start=t.index('function DistributionStory()');before=t[:start];body=t[start:]
    body=once(body,'      <div className={s.progress}>','      <DistributionCounter p={sequenceP}/>\n      <div className={s.progress}>')
    return before+body
edit('components/FormulaScrollStory.tsx',formula)

def expansion(t):
    t=once(t,"import FlowConnection from './FlowConnection'","import FlowConnection from './FlowConnection'\nimport { ACCOUNT_VIEWS } from './DistributionCounter'")
    index=[0]
    def values(m):
        i=index[0];index[0]+=1;return f'views:ACCOUNT_VIEWS[{i}]'
    t,n=re.subn(r'views:\d+',values,t);assert n==8
    t=once(t,'fmt(account.views*clamp((v-start-.012)/.012))','fmt(index===0?account.views:account.views*clamp((v-start-.012)/.012))')
    t=once(t,'<span><Eye size={11}/>','<span data-account-views><Eye size={11}/>')
    t,n=re.subn(r'^  <div className=\{s\.total\}>.*?</div>\n','',t,flags=re.M);assert n==1
    t,n=re.subn(r'^  <small className=\{s\.demo\}>.*?</small>\n','',t,flags=re.M);assert n==1
    return t
edit('components/ContentExpansionScenes.tsx',expansion)
edit('components/PlatformMetrics.tsx',lambda t:once(t,'<motion.b>{count}</motion.b>','<motion.b data-metric-value>{count}</motion.b>'))
edit('components/UnifiedFormatJourney.tsx',lambda t:once(t,'<div className={s.rail}>','<div className={s.rail} data-unified-rail>'))

def playback(t):
    t=once(t,'visible && !paused && !document.hidden','visible && !paused && !document.hidden && !element.closest(\'[aria-hidden="true"]\')')
    t=once(t,'    observer.observe(element)','    observer.observe(element)\n    const pane=element.closest(\'[data-journey-pane]\')\n    const mutations=new MutationObserver(sync)\n    if(pane)mutations.observe(pane,{attributes:true,attributeFilter:[\'aria-hidden\']})')
    t=once(t,'return () => { observer.disconnect();','return () => { observer.disconnect(); mutations.disconnect();')
    return t
edit('components/LeadMagnetComparison.tsx',playback)

AT_LEAD='''async function at(page,selector,progress){
 const mapped=selector==='[data-scroll-discovery="comparison"]'?{value:.40+progress*.32,phase:'comparison'}:selector==='#formula-lead-messages'?{value:.72+progress*.16,phase:'instagram'}:selector==='#formula-youtube'?{value:.88+progress*.12,phase:'long'}:null
 await page.locator(mapped?'[data-unified-formats]':selector).evaluate((el,p)=>{scrollTo({top:el.getBoundingClientRect().top+scrollY+p*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'})},mapped?mapped.value:progress)
 if(mapped)await page.waitForFunction(phase=>document.querySelector('[data-unified-formats]')?.getAttribute('data-journey-phase')===phase,mapped.phase)
 if(selector==='#formula-ideas')await page.waitForFunction(p=>{const i=Math.min(6,Math.floor(p*7)),root=document.querySelector('#formula-ideas');return root?.querySelector('[data-idea-example]')?.getAttribute('data-idea-example')===String(i)&&Number(getComputedStyle(root.querySelector(`[data-idea-layer="${i}"] [data-idea-reply]`)).opacity)>.99},progress)
 if(selector==='#formula-lead-messages')await page.waitForFunction(p=>{const root=document.querySelector('[data-journey-pane="instagram"]');return [['[data-scroll-reveal="comment"]',.12],['[data-scroll-reveal="reply"]',.29],['[data-lead-dm]',.54],['[data-lead-resource]',.78]].every(([q,n])=>{const v=Number(getComputedStyle(root.querySelector(q)).opacity);return p>=n?v>.99:v<.01})},progress)
 await page.waitForTimeout(450)
}
'''
EXTRA='''
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
   assert.equal(await team.locator('[data-team-cost-total]').innerText(),'0 €')
   const distribution=page.locator('[data-story="distribution"]')
   const counter=page.locator('[data-distribution-total]')
   async function distributionAt(sequence){await distribution.evaluate((el,sequence)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(sequence-.568)/.432*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'}),sequence);await page.waitForTimeout(400)}
   await distributionAt(.810);assert.equal(await counter.getAttribute('data-total'),'280000')
   const counterNode=await counter.elementHandle()
   await distributionAt(.825);assert.equal(await counter.getAttribute('data-total'),'280000','Do not restart the total at the multi-account transition')
   await distributionAt(.902);assert.equal(await counter.getAttribute('data-total'),'529000','280000 plus 249000 secondary views; never double count the 10000 original views')
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
'''

def leadtest(t):
    start=t.index('async function at(');end=t.index('async function fits(',start);t=t[:start]+AT_LEAD+t[end:]
    t=t.replace("page.locator('#formula-lead-messages')","page.locator('[data-journey-pane=\"instagram\"]')")
    t=t.replace("page.locator('#formula-youtube')","page.locator('[data-journey-pane=\"long\"]')")
    t=t.replace("long.locator('[data-format-list]", "page.locator('[data-unified-rail] [data-format-list]")
    # A successful old assertion about no actual <table> remains valid: the matrix
    # uses explicit accessible table roles and a responsive grid, not huge cards.
    marker="   reports.push({name,result:'passed'"
    assert t.count(marker)==1;t=t.replace(marker,EXTRA+'\n'+marker)
    return t
edit('scripts/check-leadmagnet-demo.mjs',leadtest)

AT_HOME='''async function at(page,t){
 const root=t>=.28&&t<.698?'[data-unified-formats]':null
 if(root){
  let raw
  if(t>=.628)raw=.72+(t-.628)/.07*.16
  else if(t>=.595)raw=.88+(t-.595)/.033*.12
  else{
   const a=[.305,.35,.415,.475,.535,.590],b=[0,.08,.16,.24,.32,.40]
   let i=a.findIndex((v,j)=>j<a.length-1&&t>=v&&t<a[j+1]);if(i<0)i=t<a[0]?0:4
   raw=b[i]+(t-a[i])/(a[i+1]-a[i])*(b[i+1]-b[i])
  }
  await page.locator(root).evaluate((el,p)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+Math.max(0,Math.min(1,p))*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'}),raw)
 }else if(t<.28||t<.768){await page.locator(t<.28?'#formula-ideas':'#formula-secret').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}))}
 else{await page.locator('[data-story="distribution"]').evaluate((el,t)=>scrollTo({top:el.getBoundingClientRect().top+scrollY+(t-.768)/.432*(el.getBoundingClientRect().height-innerHeight),behavior:'instant'}),t)}
 await page.waitForTimeout(600)
}
'''
def hometest(t):
    start=t.index('async function at(');end=t.index('async function inside(',start);return t[:start]+AT_HOME+t[end:]
edit('scripts/check-homepage-story.mjs',hometest)
print('Applied bounded homepage integration. No offers, payments, BDD or customer automation changed.')
