const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path'); const vm = require('node:vm'); const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(file, globals = {}) { const m = { exports: {} }; vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,URL,URLSearchParams,Date,console,...globals}); return m.exports; }
const yes=JSON.stringify({version:1,marketing:true,analytics:true,at:Date.now()});
function browser(raw) {
 const jar=raw?{empire_consent_v1:encodeURIComponent(raw)}:{}, calls=[], pixels=[];
 const location={hostname:'www.empire-internet.com',origin:'https://www.empire-internet.com',protocol:'https:',pathname:'/partenaire',search:'?utm_source=meta&fbclid=fixture'};
 const document={ get cookie(){return Object.entries(jar).map(([k,v])=>`${k}=${v}`).join(';')}, set cookie(v){if(v.includes('max-age=0'))return; const[k,...rest]=v.split(';')[0].split('=');jar[k]=rest.join('=')} };
 const globals={document,location,window:{location,fbq:(...v)=>pixels.push(v)},fetch:async(u,o)=>calls.push(JSON.parse(o.body))};
 const consent=load('lib/marketingConsent.ts',globals), api=load('lib/meta.ts',{...globals,require:()=>consent});return{jar,calls,pixels,api};
}
// Règle depuis le 31 octobre 2026 : tout est actif par défaut (navigateur ET copie serveur),
// seul un refus enregistré coupe. Le bandeau ne s'ouvre plus au chargement.
const consentSrc=fs.readFileSync(path.join(root,'lib/marketingConsent.ts'),'utf8');
assert.equal(load('lib/marketingConsent.ts',{document:{cookie:''}}).marketingAllowed(), true, 'sans cookie, marketing actif');
const prefsSrc=fs.readFileSync(path.join(root,'components/CookiePreferences.tsx'),'utf8');
assert(!/setOpen\(!c\)/.test(prefsSrc), 'le panneau ne doit plus s\'ouvrir au chargement');
assert(/OPEN_PREFS_EVENT/.test(prefsSrc) && /openCookiePreferences/.test(fs.readFileSync(path.join(root,'components/Footer.tsx'),'utf8')), 'le pied de page doit ouvrir le panneau');
assert(/marketing !== false/.test(consentSrc) && /analytics !== false/.test(consentSrc), 'seul un refus enregistré coupe');
for(const raw of [null,'invalid','null',JSON.stringify({version:1,marketing:false,analytics:true,at:Date.now()}),JSON.stringify({version:1,marketing:true,analytics:true,at:1})]) {
 const b=browser(raw);b.api.captureAttribution();b.api.trackMeta('CompleteRegistration',{}, {email:'fixture@example.test'});assert.equal(b.pixels.length,1);
}

const b=browser(yes);b.api.captureAttribution();b.api.trackMeta('CompleteRegistration');assert(b.jar._fbp);assert.equal(b.calls[0].event_id,b.pixels[0][3].eventID);
b.jar.empire_consent_v1=encodeURIComponent(JSON.stringify({version:1,marketing:false,analytics:false,at:Date.now()}));b.api.trackMeta('ViewContent');assert.equal(b.calls.length,2);// retirer le consentement n'arrête plus le navigateur
const events=[],pending=[];
const route=load('app/api/meta/event/route.ts',{require(name){
 if(name==='@/lib/marketingConsent')return load('lib/marketingConsent.ts');
 if(name==='@vercel/functions')return{waitUntil:p=>pending.push(p)};
 if(name==='@/lib/metaCapi')return{matchingData:()=>({}),sendCapiEvent:async e=>{events.push(e);return{ok:true}}};
 if(name==='next/server')return{NextResponse:{json:(body,opts)=>new Response(JSON.stringify(body),opts)}};
 throw new Error(name);
}});
(async()=>{
 // Refus enregistré : la copie serveur ne part pas.
 const refused=await route.POST(new Request('https://www.empire-internet.com/api/meta/event',{method:'POST',headers:{cookie:'empire_consent_v1='+encodeURIComponent(JSON.stringify({version:1,marketing:false,analytics:true,at:Date.now()}))},body:JSON.stringify({event_name:'CompleteRegistration',event_id:'fixture',email:'fixture@example.test'})}));
 assert.equal((await refused.json()).accepted,false);assert.equal(events.length,0);
 // Pas de cookie, cookie illisible, ou oui : la copie serveur part.
 for(const cookie of ['', 'empire_consent_v1=bad', 'empire_consent_v1='+encodeURIComponent(yes)]){
 const res=await route.POST(new Request('https://www.empire-internet.com/api/meta/event',{method:'POST',headers:{cookie},body:JSON.stringify({event_name:'CompleteRegistration',event_id:'fixture'})}));
 await Promise.all(pending); assert.equal((await res.json()).accepted,true,`accepté sans refus (${cookie||'sans cookie'})`);
 }
 assert.equal(events.length,3);
 console.log('Tracking: active by default in browser and server; a recorded refusal stops both; banner closed on load; no network.');
})().catch(e=>{console.error(e);process.exitCode=1});
