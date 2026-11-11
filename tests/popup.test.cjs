const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {payloadFor, popupPosition, zaloReactions} = require('../src/zalo-custom-reaction.js');
const source = fs.readFileSync(require.resolve('../src/zalo-custom-reaction.js'),'utf8');
test('native reaction giữ nguyên mã và đúng type, kể cả type 0', () => {
  assert.deepEqual(payloadFor(':>'), {rType:0,rIcon:':>',source:6});
  assert.deepEqual(payloadFor('/-heart'), {rType:5,rIcon:'/-heart',source:6});
  assert.deepEqual(payloadFor(':p'), {rType:-1,rIcon:':p',source:6});
  assert.equal(new Set(zaloReactions.map(x=>x.code)).size,55);
});
test('popup nằm trên anchor khi đủ chỗ và kẹp trong viewport', () => {
  assert.deepEqual(popupPosition({right:700,top:600,bottom:630},426,400,1000,800),{left:274,top:192});
  assert.deepEqual(popupPosition({right:20,top:5,bottom:35},300,350,360,500),{left:8,top:43});
});
async function page(url='https://chat.zalo.me/') {
  const {Window} = await import('happy-dom');
  const window = new Window({url});
  return window;
}
test('preview mở tab Zalo, chuyển Emoji và Escape không có lỗi runtime', async () => {
  const w = await page('http://localhost/');
  try {
    w.eval(source);
    const root=w.document.querySelector('#zcr-root').shadowRoot;
    assert.equal(root.querySelectorAll('.native').length,55);
    root.querySelector('[data-mode="unicode"]').click();
    assert.ok(root.querySelectorAll('.emoji').length>80);
    assert.equal(root.querySelectorAll('.native').length,0);
    root.querySelector('.search').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
    assert.equal(root.querySelector('.veil').hidden,true);
  } finally { await w.happyDOM.close(); }
});
test('chọn mã native gọi callback đúng payload rồi đóng popup', async () => {
  const w = await page();
  try {
    const list=w.document.createElement('div'); list.className='reaction-emoji-list'; w.document.body.append(list);
    let sent;
    list['__reactFiber$test']={memoizedProps:{sendReaction(payload){sent=payload;}}};
    w.eval(source);
    list.querySelector('[data-zcr-trigger]').click();
    const root=w.document.querySelector('#zcr-root').shadowRoot;
    [...root.querySelectorAll('.native')].find(b=>b.textContent.includes(':p')).click();
    await Promise.resolve(); await Promise.resolve();
    assert.equal(sent.rIcon,':p'); assert.equal(sent.rType,-1);
    assert.equal(root.querySelector('.veil').hidden,true);
    assert.ok(w.localStorage.getItem('zcr-plus-v2').includes(':p'));
  } finally { await w.happyDOM.close(); }
});
test('bấm ngoài popup đóng, lỗi callback giữ popup và báo lỗi', async () => {
  const w=await page();
  try {
    const list=w.document.createElement('div'); list.className='reaction-emoji-list'; w.document.body.append(list);
    list['__reactFiber$test']={memoizedProps:{sendReaction(){throw new Error('test rejection');}}};
    w.eval(source); list.querySelector('[data-zcr-trigger]').click();
    const root=w.document.querySelector('#zcr-root').shadowRoot;
    root.querySelector('.native').click(); await Promise.resolve();
    assert.equal(root.querySelector('.veil').hidden,false);
    assert.match(root.querySelector('.status').textContent,/test rejection/);
    w.document.body.dispatchEvent(new w.PointerEvent('pointerdown',{bubbles:true,composed:true}));
    assert.equal(root.querySelector('.veil').hidden,true);
  } finally { await w.happyDOM.close(); }
});
test('chỉ lấy ảnh có mã khớp từ DOM và gửi đúng mã của ảnh', async () => {
  const w=await page('http://localhost/');
  try {
    w.document.body.innerHTML='<img alt=":p" src="https://example.com/tongue.png"><img alt="unrelated" src="https://example.com/other.png">';
    w.eval(source);
    const root=w.document.querySelector('#zcr-root').shadowRoot;
    const b=[...root.querySelectorAll('.native')].find(x=>x.textContent.includes(':p'));
    assert.equal(b.querySelector('img').src,'https://example.com/tongue.png');
    b.click();
    assert.match(root.querySelector('.status').textContent,/:p/);
    assert.equal(root.querySelector('.veil').hidden,false);
  } finally { await w.happyDOM.close(); }
});
