/* Standalone no-dependency checks: node tests/attestation.test.cjs */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const newPaths = [
  'services/indian-certificate-attestation-dubai.html',
  'services/degree-certificate-attestation-dubai.html',
  'services/marriage-certificate-attestation-dubai.html',
  'services/birth-certificate-attestation-dubai.html',
  'tools/attestation-checker.html'
];
let checks=0;
function check(label, fn) { fn(); checks++; process.stdout.write('PASS '+label+'\n'); }
const sitemap=read('sitemap.xml');
const urls=Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g),m=>m[1]);
check('43 unique sitemap URLs',()=>{ assert.equal(urls.length,43);assert.equal(new Set(urls).size,43); });
check('All sitemap pages exist and canonicals match',()=>{
 for(const u of urls){
  const rel=u.replace('https://quickdocsuae.com/','').replace(/\/$/,'/index.html')||'index.html';
  const f=path.join(root,rel);
  assert.ok(fs.existsSync(f),rel+' missing');
  assert.ok(read(rel).includes('rel="canonical" href="'+u+'"'),rel+' canonical mismatch');
 }
});
check('New pages have unique titles, H1, JSON-LD and tracking',()=>{
 const titles=new Set();
 for(const p of newPaths){
  const s=read(p),title=s.match(/<title>(.*?)<\/title>/);
  assert.ok(title,p+' no title');assert.ok(!titles.has(title[1]),'duplicate title');titles.add(title[1]);
  assert.equal((s.match(/<h1\b/g)||[]).length,1,p+' h1');
  assert.ok(s.includes('src="/assets/qd-analytics-config.js"'),p+' missing config');
  assert.ok(s.includes('qd-tracking.js'),p+' missing tracker');
  for(const match of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);
  for(const m of s.matchAll(/href="(\/(?:services|tools|articles)\/[^"#]*)"/g)){
   const target=m[1].slice(1).replace(/\/$/,'/index.html');
   assert.ok(fs.existsSync(path.join(root,target)),p+' links missing: '+target);
  }
 }
});
check('Scripts parse',()=>{
 for(const file of ['assets/attestation-checker.js','assets/qd-tracking.js','assets/qd-analytics-config.js']){
  new vm.Script(read(file),{filename:file});
 }
});
check('Checker offers results and safe WhatsApp URL in three routes',()=>{
 const source=read('assets/attestation-checker.js');
 for(const issued of ['india','uae','other']){
  const handlers={};const li=[];
  const form={elements:{issued:{value:issued},document_type:{value:'degree'},use:{value:'uae'},completed:{value:'unknown'}},addEventListener:(n,fn)=>handlers[n]=fn};
  const anchor={href:''};const h={textContent:''};
  const list={replaceChildren:()=>li.splice(0),appendChild:x=>li.push(x.textContent)};
  const result={hidden:true,querySelector:sel=>sel==='[data-qd-steps]'?list:sel==='[data-qd-wa]'?anchor:h,scrollIntoView:()=>{}};
  const document={getElementById:id=>id==='qd-attestation-form'?form:result,createElement:()=>({textContent:''})};
  const events=[];
  const context={document,window:{quickdocsTrack:(name)=>events.push(name)},encodeURIComponent};
  vm.runInNewContext(source,context,{timeout:1000});
  handlers.change({});
  handlers.submit({preventDefault:()=>{}});
  assert.equal(result.hidden,false);assert.ok(li.length>=4);
  assert.ok(anchor.href.startsWith('https://wa.me/971508979376?text='));
  assert.deepEqual(events,['attestation_checker_start','attestation_checker_complete']);
 }
});
console.log('All '+checks+' attestation tests passed.');
