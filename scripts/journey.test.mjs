import test from 'node:test';
import assert from 'node:assert/strict';
import {createJourney,activeElapsed,journeySource,articleDepth,blogSections} from '../src/lib/journey.ts';
import {createMeasurement} from '../src/lib/measurement.ts';
const token='a'.repeat(43);
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function browser() {
  let time=0,cookie='',visible='visible',focused=true;const storage=new Map(),listeners=new Map(),calls=[],timers=new Map();let timer=0;
  const rect={top:0,bottom:800};
  const win={location:{href:'https://www.standinpose.com/?utm_source=instagram&utm_content=meta-poster-a',pathname:'/'},crypto:globalThis.crypto,
    performance:{now:()=>time},innerHeight:800,scrollY:0,matchMedia:()=>({matches:false}),
    localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},
    fetch:async(url,options)=>{const body=JSON.parse(options.body);calls.push({url,body,options});return {ok:true,status:200,json:async()=>url.endsWith('/visitors')?{token}:url.endsWith('/handoff')?{token:'b'.repeat(43)}:{accepted:body.events?.length}};},
    addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k),
    setInterval:f=>{timers.set(++timer,f);return timer;},clearInterval:n=>timers.delete(n),
    document:{get cookie(){return cookie;},set cookie(value){cookie=value.includes('Max-Age=0')?'':value.split(';')[0];},
      get visibilityState(){return visible;},hasFocus:()=>focused,getElementById:id=>id==='hero'?{getBoundingClientRect:()=>rect}:null,
      documentElement:{scrollHeight:2400},addEventListener:(k,f)=>listeners.set(k,f),removeEventListener:k=>listeners.delete(k)},
  };
  return {win,calls,listeners,storage,advance(ms){time+=ms;timers.forEach(f=>f());},hide(){visible='hidden';listeners.get('visibilitychange')?.();},show(){visible='visible';listeners.get('visibilitychange')?.();},blur(){focused=false;listeners.get('blur')?.();}};
}

test('blog source classification never retains queries and respects exact host boundaries',()=>{
  const page='https://www.standinpose.com/blog/bvh-vs-fbx/';
  for(const [ref,source] of [['https://search.naver.com/search.naver?query=private','naver'],['https://www.google.com/search?q=private','google'],['https://www.standinpose.com/blog/','internal'],['https://google.com.evil.test/','referral'],['','direct']]) assert.equal(journeySource(page,ref),source);
  assert.equal(journeySource(page+'?utm_source=instagram','https://google.com/'),'instagram');
  assert.equal(journeySource(page+'?utm_source=private-email'),'other');
  assert.equal(articleDepth(-1200,400,800),100);
  assert.equal(articleDepth(400,2000,800),25);
});

test('every blog page requires opt-in; reading sections and active dwell reach the existing collector',async()=>{
  for(const path of Object.keys(blogSections)) {
    const b=browser();b.win.location={href:'https://www.standinpose.com'+path,pathname:path};
    b.win.document.referrer='https://search.naver.com/?query=private';
    const id=path==='/blog/'?'blog-list':'article-intro';
    b.win.document.getElementById=key=>key===id?{getBoundingClientRect:()=>({top:0,bottom:800})}:key==='blog-content'?{getBoundingClientRect:()=>({top:0,bottom:2400})}:null;
    const journey=createJourney(b.win);assert.equal(b.calls.length,0);
    assert.equal(createMeasurement({enabled:true,ga4Id:'',pixelId:'',journey},b.win).available,true);
    await journey.setAllowed(true);await settle();for(let i=0;i<10;i++)b.advance(1000);await settle();
    const events=b.calls.flatMap(c=>c.body.events||[]);
    assert.ok(events.some(e=>e.name==='page_view'&&e.path===path&&e.source==='naver'));
    assert.ok(events.some(e=>e.name==='section_engagement'&&e.section===id&&e.elapsedMs===10000));
    assert.ok(!JSON.stringify(events).includes('private'));
    await journey.setAllowed(false);
  }
});
test('content-first rollout defers blog events, preserves revocation and legacy source values',async()=>{
  const b=browser();b.win.location={href:'https://www.standinpose.com/blog/bvh-vs-fbx/',pathname:'/blog/bvh-vs-fbx/'};
  b.win.document.cookie='standin_journey='+token;
  const journey=createJourney(b.win,undefined,false);
  await journey.setAllowed(true);b.advance(10000);await settle();
  assert.equal(b.calls.length,0);
  await journey.setAllowed(false);await settle();
  assert.ok(b.calls.some(c=>c.url.endsWith('/revoke')));
  assert.equal(b.win.document.cookie,'');
  const home=browser();home.win.location={href:'https://www.standinpose.com/?utm_source=naver',pathname:'/'};
  home.win.document.referrer='https://search.naver.com/?query=private';
  await createJourney(home.win,undefined,false).setAllowed(true);await settle();
  assert.ok(home.calls.flatMap(c=>c.body.events??[]).every(e=>e.source==='other'));
});
test('elapsed time excludes hidden time and stops at the idle boundary',()=>{
  assert.equal(activeElapsed(1000,11000,1000,true),10000);assert.equal(activeElapsed(1000,11000,1000,false),0);
  assert.equal(activeElapsed(50000,100000,0,true),10000);assert.equal(activeElapsed(100000,110000,0,true),0);
});
test('opt-in creates a visitor; hidden time and unknown properties never enter event batches',async()=>{
  const b=browser(),journey=createJourney(b.win);assert.equal(b.calls.length,0);
  await journey.setAllowed(true);await settle();assert.ok(journey.link()?.startsWith('standin://journey?token='));
  for(let i=0;i<10;i++)b.advance(1000);await settle();
  b.hide();await settle();b.advance(120000);b.show();for(let i=0;i<10;i++)b.advance(1000);await settle();
  journey.event('download_click','download_windows');await settle();
  const events=b.calls.flatMap(c=>c.body.events??[]);
  assert.equal(events.filter(e=>e.name==='page_view').length,1);
  assert.equal(events.filter(e=>e.name==='section_engagement').reduce((n,e)=>n+e.elapsedMs,0),20000);
  assert.equal(events.filter(e=>e.name==='download_click').length,1);
  assert.ok(b.calls.every(c=>c.options.credentials==='omit'&&c.options.referrerPolicy==='no-referrer'));
  assert.ok(events.every(e=>!('url'in e)&&!('email'in e)&&!('token'in e)));
  await journey.setAllowed(false);const count=b.calls.length;b.advance(10000);journey.event('download_click','download_windows');await settle();
  assert.equal(b.calls.length,count);assert.equal(journey.link(),null);assert.equal(b.win.document.cookie,'');
});
test('withdrawal racing visitor creation deletes the new capability without a page event',async()=>{
  const b=browser();let resolve;const initial=b.win.fetch;
  b.win.fetch=async(url,options)=>url.endsWith('/visitors')?new Promise(r=>{resolve=()=>r({ok:true,json:async()=>({token})});}):initial(url,options);
  const journey=createJourney(b.win),starting=journey.setAllowed(true);await settle();
  await journey.setAllowed(false);resolve();await starting;await settle();
  assert.ok(b.calls.some(c=>c.url.endsWith('/revoke')));assert.ok(!b.calls.some(c=>c.url.endsWith('/events')));assert.equal(journey.link(),null);
});
test('legacy grants do not authorize the new scope, but legacy refusals remain respected',()=>{
  for(const granted of [false,true]){
    const b=browser();b.win.localStorage.setItem('standin.measurement.v2',JSON.stringify({version:2,analytics:granted,advertising:granted,expiresAt:Date.now()+10000}));
    let enabled=false;const m=createMeasurement({enabled:true,ga4Id:'',pixelId:'',journey:{setAllowed:async v=>{enabled=v;return true;},event(){}}},b.win);
    assert.deepEqual(m.start(),granted?null:{analytics:false,advertising:false});assert.equal(enabled,false);
  }
});
