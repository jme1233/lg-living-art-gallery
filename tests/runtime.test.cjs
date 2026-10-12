/* Deterministic logic checks, not a desktop browser or webOS emulator. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'gallery.js'), 'utf8');
function harness(options = {}) {
  let now = 0, id = 0;
  const timers = new Map(), elements = {};
  const ids = ['art','controls','message','status','interval','toggle','title','artist','prev','next','fullscreen','hide','stage','diagnostics','diagnostic-panel','diagnostic-text'];
  ids.forEach(name => elements[name] = {style: {},textContent:'',tagName: name === 'interval' ? 'SELECT' : 'DIV',setAttribute(k,v){this[k]=v;},contains(el){return el === elements.hide;}});
  elements.interval.value = '30000';
  elements.interval.options = ['10000','30000','60000','300000','600000','900000'].map(value=>({value}));
  const document = {getElementById: name=>elements[name],documentElement:{clientWidth:1920,clientHeight:1080},activeElement:null};
  const storage = {value: options.saved || null,getItem(){if(options.storageThrows)throw Error('denied'); return this.value;},setItem(k,v){if(options.storageThrows)throw Error('denied');this.value=v;}};
  const window = {localStorage:storage,setTimeout(fn,ms){timers.set(++id,{time:now+ms,fn});return id;},clearTimeout(id){timers.delete(id);}};
  const context = {window,document,navigator:{userAgent:'SIMULATED DOM; not a browser'},Image:function(){Object.defineProperty(this,'src',{get(){return this.url;},set(url){this.url=url;if(options.neverLoads)return;if(options.fail && options.fail(url)){if(this.onerror)this.onerror();}else{this.naturalWidth=3840;this.naturalHeight=2160;this.onload();}}});}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'artwork.js'),'utf8'),context);
  window.GALLERY_ARTWORK=context.GALLERY_ARTWORK;
  vm.runInContext(code,context);
  function tick(ms){const end=now+ms;let guard=0;while(true){const next=[...timers].filter(([,t])=>t.time<=end).sort((a,b)=>a[1].time-b[1].time)[0];if(!next)break;if(++guard>1000)throw Error('timer loop');now=next[1].time;timers.delete(next[0]);next[1].fn();}now=end;}
  return {elements,window,document,storage,tick};
}
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
test('initial JPEG fitted without cropping; next / previous wrap',()=>{const h=harness(),e=h.elements;assert.equal(e.title.textContent,'Moonlit Ridge');assert.equal(e.art.style.width,'1920px');assert.equal(e.art.style.height,'1080px');e.prev.onclick();assert.equal(e.title.textContent,'Quiet Horizon');e.next.onclick();assert.equal(e.title.textContent,'Moonlit Ridge');});
test('10-second rotation, interval restart and three transitions',()=>{const h=harness(),e=h.elements;e.interval.value='10000';e.interval.onchange();h.tick(9999);assert.equal(e.title.textContent,'Moonlit Ridge');h.tick(1);assert.equal(e.title.textContent,'Tidal Ribbons');h.tick(10000);assert.equal(e.title.textContent,'Quiet Horizon');h.tick(10000);assert.equal(e.title.textContent,'Moonlit Ridge');e.interval.value='30000';e.interval.onchange();h.tick(29999);assert.equal(e.title.textContent,'Moonlit Ridge');h.tick(1);assert.equal(e.title.textContent,'Tidal Ribbons');});
test('pause holds image; resume gives full interval',()=>{const h=harness(),e=h.elements;e.toggle.onclick();h.tick(60000);assert.equal(e.title.textContent,'Moonlit Ridge');e.toggle.onclick();h.tick(30000);assert.equal(e.title.textContent,'Tidal Ribbons');});
test('interval persists and denied storage does not block playback',()=>{const h=harness({saved:'60000'});assert.equal(h.elements.interval.value,'60000');h.elements.interval.value='10000';h.elements.interval.onchange();assert.equal(h.storage.value,'10000');const blocked=harness({storageThrows:true});blocked.tick(30000);assert.equal(blocked.elements.title.textContent,'Tidal Ribbons');});
test('auto-hide, Enter recovery, and hidden focus released',()=>{const h=harness(),e=h.elements;h.tick(12000);assert.equal(e.controls.style.display,'none');h.document.onkeydown({keyCode:13});assert.equal(e.controls.style.display,'block');let blurred=false;e.hide.blur=()=>{blurred=true;h.document.activeElement=null;};h.document.activeElement=e.hide;e.hide.onclick();assert.ok(blurred);h.document.onkeydown({keyCode:39});assert.equal(e.title.textContent,'Tidal Ribbons');});
test('portrait viewport contains landscape artwork',()=>{const h=harness();h.document.documentElement.clientWidth=600;h.document.documentElement.clientHeight=900;h.window.onresize();assert.equal(h.elements.art.style.width,'600px');assert.equal(h.elements.art.style.height,'338px');assert.equal(h.elements.art.style.top,'281px');});
test('missing fullscreen API has browser-menu fallback',()=>{const h=harness();h.elements.fullscreen.onclick();assert.match(h.elements.status.textContent,/browser menu/);});
test('failed first JPEG skips and all failures stop with visible error',()=>{const h=harness({fail:url=>url.indexOf('moonlit')>=0});h.tick(1000);assert.equal(h.elements.title.textContent,'Tidal Ribbons');const all=harness({fail:()=>true});all.tick(2000);assert.match(all.elements.message.textContent,/could not load/);assert.equal(all.elements.toggle.textContent,'Resume');assert.equal(all.elements.controls.style.display,'block');});
test('stalled image loading times out rather than waiting forever',()=>{const h=harness({neverLoads:true});h.tick(63000);assert.match(h.elements.message.textContent,/could not load/);assert.equal(h.elements.toggle.textContent,'Resume');});
test('diagnostics stays open and reports source dimensions',()=>{const h=harness();h.elements.diagnostics.onclick();h.tick(20000);assert.equal(h.elements.controls.style.display,'block');assert.match(h.elements['diagnostic-text'].textContent,/3840 × 2160/);});
test('all local runtime assets referenced by the manifest exist',()=>{const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'artwork.js'),'utf8'),context);for(const piece of context.GALLERY_ARTWORK)assert.ok(fs.existsSync(path.join(root,piece.src)));for(const name of ['index.html','gallery.css','gallery.js','artwork.js','.nojekyll'])assert.ok(fs.existsSync(path.join(root,name)));});
console.log(`${count} logic checks passed. Browser and TV validation are separate.`);
