'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const appRoot = process.argv[2];
if (!appRoot) throw new Error('Usage: node scripts/check-meta-cross-domain.cjs <app-repo>');
const { chromium } = require(path.join(appRoot, 'node_modules/playwright'));
const js = file => ts.transpileModule(process.argv.includes('--baseline') && file.endsWith('/lib/meta.ts') ? require('node:child_process').execFileSync('git', ['show', 'origin/master:lib/meta.ts'], { cwd: path.resolve(__dirname, '..'), encoding: 'utf8' }) : fs.readFileSync(file,'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><body>Offline attribution test</body></html>' }));
    await context.addCookies([{ name: '_fbp', value: 'fb.1.123.existing', url: 'https://www.empire-internet.com', secure: true }]);
    const page = await context.newPage();
    await page.goto('https://www.empire-internet.com/partenaire?fbclid=fixtureClick&utm_campaign=fixtureCampaign&utm_content=fixtureAd');
    const marketing = await page.evaluate(code => {
      window.exports = {}; (0,eval)(code); window.marketing = window.exports;
      window.marketing.captureAttribution();
      return { attribution: window.marketing.readAttribution(), next: window.marketing.attributedUrl ? window.marketing.attributedUrl('https://app.empire-internet.com/join/academy?offer=partner') : 'https://app.empire-internet.com/join/academy?offer=partner' };
    }, js(path.resolve(__dirname, '../lib/meta.ts')));
    let cookies = await context.cookies();
    for (const name of ['_fbp','_fbc']) {
      const hits = cookies.filter(x => x.name === name);
      assert.equal(hits.length,1);assert.equal(hits[0].domain,'.empire-internet.com');assert.equal(hits[0].secure,true);
    }
    assert.equal(marketing.attribution.fbp,'fb.1.123.existing');
    assert.equal(new URL(marketing.next).searchParams.get('fbclid'),'fixtureClick');
    assert.equal(new URL(marketing.next).searchParams.get('utm_content'),'fixtureAd');
    // No query parameters: shared cookies must also support a static WebinarJam CTA.
    await page.goto('https://app.empire-internet.com/join/academy?offer=partner');
    const appAttr = await page.evaluate(code => { window.exports={};(0,eval)(code); window.checkout = window.exports; return window.checkout.checkoutAttribution(); }, js(path.join(appRoot,'src/lib/checkoutAttribution.ts')));
    assert.equal(appAttr.fbp,marketing.attribution.fbp); assert.equal(appAttr.fbc,marketing.attribution.fbc);assert.equal(appAttr.utm_content,'fixtureAd');
    const pair = await page.evaluate(code => {
      window.exports={}; window.calls=[];window.pixels=[];
      window.fbq=(...args)=>window.pixels.push(args);
      window.fetch=async (url,options)=>{window.calls.push(JSON.parse(options.body));return new Response('{}');};
      window.require=name=>name==='./nativeApp'?{isNativeApp:()=>false}:window.checkout;
      (0,eval)(code);window.exports.trackAcademyCheckout(497,'partner');
      return { calls:window.calls,pixels:window.pixels };
    }, js(path.join(appRoot,'src/lib/metaAcademy.ts')));
    const pixel=pair.pixels.find(x=>x[1]==='InitiateCheckout');
    assert.equal(pixel[3].eventID,pair.calls[0].event_id);assert.equal(pixel[2].value,497);
    console.log('Chromium: shared domain cookies, host-only cleanup, UTM/fbclid links, static CTA attribution and paired InitiateCheckout passed (all network intercepted)');
  } finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
