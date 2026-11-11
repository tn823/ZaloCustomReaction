// ==UserScript==
// @name         ZaloCustomReaction Plus
// @namespace    local.zalo-custom-reaction
// @version      2.1.0
// @description  Bảng reaction mở rộng: tìm kiếm, yêu thích, gần đây và giao diện sáng/tối.
// @match        https://chat.zalo.me/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

// React sendReaction payload/hash compatible with Zalo Custom Reaction by Anh Duc Le.
(() => {
  'use strict';
  const groups = [
    ['Cảm xúc', 'mặt cười vui buồn smile happy sad love', '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🫣 🤭 🫢 🫡 🤫 🫠 🤥 😶 🫥 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👻 💀 ☠️ 👽 🤖 💩'],
    ['Cử chỉ', 'tay vỗ cảm ơn đồng ý clap thanks hand ok', '👍 👎 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💪 🦾 👋 🤚 🖐️ ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✊ 👊 🤛 🤜 🫶 🫵 💅 🤳'],
    ['Tình yêu', 'tim yêu thương heart love', '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 🩷 🩵 🩶 💔 ❤️‍🔥 ❤️‍🩹 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 💌 💋 🫂 🌹 🥀 💐'],
    ['Ăn mừng', 'chúc mừng sinh nhật lửa sao party fire star', '🎉 🎊 🎈 🎁 🎀 🎂 🥂 🍻 🏆 🥇 🥈 🥉 🏅 🎖️ 👑 💎 🔥 ✨ ⭐ 🌟 💫 💥 💯 ✅ ☑️ ❌ ❗ ❓ ⚡ 🚀 🎯 💡 🪄 🎵 🎶'],
    ['Động vật', 'mèo chó thú cat dog animal', '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🙈 🙉 🙊 🐔 🐧 🐦 🐤 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🦋 🐌 🐞 🐢 🐍 🦖 🐙 🦑 🦀 🐠 🐬 🐳 🦈 🐊 🐘 🦒 🐕 🐈 🦔'],
    ['Ăn uống', 'đồ ăn nước cà phê food coffee drink', '🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🥑 🍆 🥕 🌽 🌶️ 🥒 🥦 🍄 🥜 🍞 🥐 🥖 🧀 🍳 🥓 🥩 🍗 🍔 🍟 🍕 🌭 🥪 🌮 🍜 🍝 🍣 🍤 🍚 🍙 🍦 🍨 🍩 🍪 🍰 🧁 🍫 🍿 ☕ 🍵 🧋 🥤 🍺 🍷'],
    ['Thiên nhiên', 'hoa cây trời nắng mưa nature weather', '🌸 🌺 🌻 🌼 🌷 🪷 🌱 🌲 🌳 🌴 🌵 🌿 ☘️ 🍀 🍁 🍂 🍃 🌍 🌎 🌏 🌕 🌙 ☀️ 🌤️ ⛅ 🌧️ ⛈️ 🌈 ☁️ ❄️ ☃️ 🌊 💧 🫧'],
    ['Hoạt động', 'thể thao game làm việc sport work', '⚽ 🏀 🏈 ⚾ 🎾 🏐 🏓 🏸 🥊 🎮 🕹️ 🎲 🧩 🎨 🎬 🎤 🎧 🎸 🎹 📚 📖 ✏️ 📝 💻 ⌨️ 📱 📷 💰 💸 🛒 🛍️ 🏠 🚗 ✈️ 🛵 🚲 🧳 ⏰ 🛌']
  ].map(([name, keywords, text]) => ({ name, keywords, emojis: text.split(' ') }));
  const hash = text => { let h = 0; for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0; return Math.abs(h); };
  const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const findSender = element => {
    for (let node = element, depth = 0; node && depth < 12; node = node.parentElement, depth++) {
      const key = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
      let fiber = key && node[key];
      const seen = new Set();
      while (fiber && !seen.has(fiber)) {
        seen.add(fiber);
        for (const props of [fiber.memoizedProps, fiber.pendingProps]) {
          if (typeof props?.sendReaction === 'function') return props.sendReaction.bind(props);
        }
        fiber = fiber.return;
      }
    }
    return null;
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = { hash, normalize, findSender, groups }; return; }
  if (document.getElementById('zcr-root')) return;
  const storageKey = 'zcr-plus-v2';
  let state = { favorites: ['❤️', '👏', '🎉', '🔥', '💯', '🫶'], recent: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    for (const key of ['favorites', 'recent']) if (Array.isArray(saved?.[key])) state[key] = [...new Set(saved[key].filter(x => typeof x === 'string' && x.length <= 64))].slice(0, 48);
  } catch { /* Storage unavailable or invalid: use defaults. */ }
  const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { status.textContent = 'Trình duyệt không cho lưu lịch sử.'; } };
  const host = document.createElement('div'); host.id = 'zcr-root'; document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>
    :host{all:initial;color-scheme:light dark}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid #5d83ff;outline-offset:2px}
    .veil{position:fixed;inset:0;background:#11182755;z-index:2147483646;display:grid;place-items:center;font:14px/1.5 system-ui,sans-serif;color:#17233e}.veil[hidden]{display:none}
    .panel{width:min(360px,calc(100vw - 24px));max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:#fff;border:1px solid #e1e7f2;border-radius:14px;box-shadow:0 24px 90px #081c4540;overflow:hidden}
    header{padding:14px 16px 10px;background:#f7f9fc}h2{font-size:16px;margin:0;font-weight:750}p{margin:3px 0;color:#64748b;font-size:12px}.top{display:flex;justify-content:space-between;align-items:center}.close{border:0;background:#ffffffaa;border-radius:50%;width:32px;height:32px;font-size:22px}
    .search{margin-top:14px;width:100%;padding:12px 14px;border:1px solid #dbe3f0;border-radius:12px;background:#fff;color:inherit}.tabs{display:flex;gap:6px;padding:12px 16px;overflow:auto;flex-shrink:0}.tab{white-space:nowrap;border:0;border-radius:20px;padding:7px 12px;background:#f0f3f9;color:inherit;font-size:12px}.tab[aria-selected=true]{background:#3865ed;color:white}
    .grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px;padding:4px 16px 16px;overflow:auto;min-height:180px;max-height:310px}.emoji{border:0;border-radius:12px;background:transparent;font-size:23px;min-height:36px;position:relative;transition:none}.emoji:hover{background:#edf2ff}.emoji[data-favorite=true]:after{content:'★';position:absolute;right:1px;bottom:0;font-size:10px;color:#d48a00}.empty{grid-column:1/-1;align-self:center;text-align:center;color:#64748b}
    footer{padding:12px 20px 18px;border-top:1px solid #edf0f6}.custom{display:flex;gap:8px}.custom input{min-width:0;flex:1;border:1px solid #dbe3f0;border-radius:10px;padding:9px;color:inherit;background:transparent}.send{border:0;border-radius:10px;padding:9px 14px;background:#3865ed;color:white}.status{font-size:12px;color:#64748b;margin-top:8px;min-height:18px}
    @media(prefers-color-scheme:dark){.panel{background:#182135;border-color:#33415a;color:#e7edff}header{background:#1b273b}.search{background:#131d30;border-color:#3a4961}.tab{background:#29364d}.close{background:#35415a;color:#fff}.emoji:hover{background:#304369}footer{border-color:#33415a}.custom input{border-color:#3a4961}p,.status{color:#a9b6cf}}
    /* Compact dark picker inspired by the native Zalo emoji panel. */
    :host{color-scheme:dark}
    .veil{background:#0003;color:#d9dce1}
    .panel{width:min(426px,calc(100vw - 20px));background:#22272b;border:1px solid #4a5057;border-radius:10px;box-shadow:0 8px 28px #0005}
    header{padding:0 16px 10px;background:#22272b!important}
    .top{height:56px;border-bottom:1px solid #383e44;margin:0 -16px 10px;padding:0 16px}
    h2{color:#64a6ff;font-size:14px;font-weight:650;letter-spacing:.4px}
    header .top p{display:none}.close{background:transparent!important;color:#a7b1bd!important}
    .search{margin:0;padding:7px 10px;border:1px solid #3d454d;background:#1c2125!important;border-radius:5px;font-size:12px;color:#d9dce1}
    .grid{min-height:230px;max-height:340px;gap:2px;padding:6px 16px 12px;scrollbar-width:thin;scrollbar-color:#41474c transparent}
    .emoji{font-size:28px;min-height:42px;border-radius:5px;transition:none}.emoji:hover{background:#414953!important;transform:none}
    .group-title{grid-column:1/-1;font-size:13px;font-weight:650;color:#d9dce1;margin:10px 2px 4px}
    .tabs{order:3;padding:0 8px;height:48px;border-top:1px solid #383e44;gap:0;scrollbar-width:thin;align-items:stretch}
    .tab{min-width:38px;padding:6px;background:transparent!important;border-radius:0;color:#98a5b5;font-size:22px;border-bottom:2px solid transparent}
    .tab[aria-selected=true]{color:#64a6ff;border-bottom-color:#64a6ff}
    footer{order:4;padding:8px 14px 10px;border-top:1px solid #383e44;font-size:12px}
    .custom input{border:1px solid #414952!important;border-radius:5px;padding:6px 8px;font-size:12px}
    .send{border-radius:5px;padding:6px 12px;background:#397cd2;font-size:12px}
    .status{font-size:11px;color:#a8b1bd;min-height:0;margin-top:6px}footer>p{font-size:10px;color:#98a5b5}
    @media(prefers-reduced-motion:reduce){.emoji{transition:none}.emoji:hover{transform:none}}
  </style><div class="veil" hidden><section class="panel" role="dialog" aria-modal="true" aria-labelledby="title"><header><div class="top"><div><h2 id="title">Reaction</h2><p>ZaloCustomReaction · ${groups.reduce((n,g)=>n+g.emojis.length,0)} emoji có sẵn</p></div><button class="close" aria-label="Đóng">×</button></div><input class="search" aria-label="Tìm emoji" placeholder="Tìm: tim, vui, mèo, coffee hoặc emoji…"></header><div class="tabs" role="tablist" aria-label="Nhóm emoji"></div><div class="grid" aria-label="Emoji"></div><footer><div class="custom"><input maxlength="64" aria-label="Reaction tùy chỉnh" placeholder="Emoji hoặc nội dung riêng…"><button class="send">Gửi</button></div><div class="status" role="status" aria-live="polite"></div><p>Chọn để gửi · Shift + nhấp để lưu yêu thích</p></footer></section></div>`;
  const $ = selector => shadow.querySelector(selector);
  const veil = $('.veil'), grid = $('.grid'), tabs = $('.tabs'), search = $('.search'), custom = $('.custom input'), status = $('.status');
  let active = 'Cảm xúc', context = null, previousFocus = null, sending = false;
  const names = ['Tất cả', '⭐ Yêu thích', '🕘 Gần đây', ...groups.map(g => g.name)];
  const categoryIcons = ['≡', '☆', '◷', '☺', '☞', '♡', '✧', '♞', '☕', '❀', '⚽'];
  function render() {
    tabs.replaceChildren(...names.map((name, index) => {
      const b = document.createElement('button'); b.className = 'tab'; b.textContent = categoryIcons[index]; b.title = name; b.setAttribute('aria-label', name); b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(active === name));
      b.onclick = () => { active = name; render(); }; return b;
    }));
    let emojis = active === names[1] ? state.favorites : active === names[2] ? state.recent : groups.filter(g => active === 'Tất cả' || g.name === active).flatMap(g => g.emojis);
    const q = normalize(search.value.trim());
    if (q) emojis = emojis.filter(e => e.includes(search.value.trim()) || groups.some(g => g.emojis.includes(e) && normalize(g.name + ' ' + g.keywords).includes(q)));
    grid.replaceChildren(...[...new Set(emojis)].map(emoji => {
      const b = document.createElement('button'); b.className = 'emoji'; b.textContent = emoji; b.title = `${emoji} · Shift + nhấp: yêu thích`; b.setAttribute('aria-label', `Gửi ${emoji}`); b.dataset.favorite = state.favorites.includes(emoji);
      b.onclick = event => {
        if (event.shiftKey) { state.favorites = state.favorites.includes(emoji) ? state.favorites.filter(x => x !== emoji) : [emoji, ...state.favorites].slice(0,48); save(); render(); }
        else send(emoji);
      }; return b;
    }));
    if (!grid.childNodes.length) { const p = document.createElement('p'); p.className = 'empty'; p.textContent = 'Chưa có emoji. Thử nhóm khác hoặc nhập nội dung riêng.'; grid.append(p); }
    if (!q && active === 'Cảm xúc') {
      const heading = document.createElement('div'); heading.className = 'group-title'; heading.textContent = 'Emoji'; grid.prepend(heading);
      if (state.recent.length) {
        const recentHeading = document.createElement('div'); recentHeading.className = 'group-title'; recentHeading.textContent = 'Gần đây';
        const buttons = state.recent.slice(0, 8).map(emoji => {
          const b = document.createElement('button'); b.className = 'emoji'; b.textContent = emoji; b.title = emoji; b.setAttribute('aria-label', `Gửi ${emoji}`); b.onclick = () => send(emoji); return b;
        });
        grid.prepend(recentHeading, ...buttons);
      }
    }
  }
  function close() { veil.hidden = true; context = null; if (previousFocus?.isConnected) previousFocus.focus(); }
  function open(anchor, preview = false) {
    context = { anchor, sender: preview ? null : findSender(anchor), preview };
    previousFocus = document.activeElement; search.value = ''; custom.value = ''; active = 'Cảm xúc';
    status.textContent = preview ? 'Chế độ xem thử — không gửi reaction.' : context.sender ? 'Sẵn sàng · mỗi lần chọn gửi một reaction.' : 'Chưa tìm thấy hàm gửi. Đóng và mở lại menu reaction của tin nhắn.';
    veil.hidden = false; render(); search.focus();
  }
  async function send(value) {
    const text = value.trim(); if (!text || sending || !context) return;
    if (context.preview) { status.textContent = `Xem thử: ${text} (chưa gửi)`; return; }
    if (!context.sender) { status.textContent = 'Không thể gửi: Zalo có thể đã đổi giao diện. Hãy mở lại menu reaction.'; return; }
    sending = true; $('.send').disabled = true;
    try {
      await context.sender({ rType: text === '👏' ? 100 : text === '🎉' ? 101 : hash(text), rIcon: text });
      state.recent = [text, ...state.recent.filter(x => x !== text)].slice(0,32); save();
      status.textContent = 'Đã chuyển reaction cho Zalo; kiểm tra kết quả trên tin nhắn.';
    } catch (error) { status.textContent = `Không gửi được: ${error?.message || 'Lỗi không xác định'}`; }
    finally { sending = false; $('.send').disabled = false; }
  }
  $('.close').onclick = close; veil.onclick = e => { if (e.target === veil) close(); };
  let searchTimer;
  search.oninput = () => { clearTimeout(searchTimer); searchTimer = setTimeout(render, 100); }; $('.send').onclick = () => send(custom.value);
  custom.onkeydown = e => { if (e.key === 'Enter' && !e.isComposing) send(custom.value); };
  shadow.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Tab') {
      const elements = [...shadow.querySelectorAll('button,input')].filter(x => !x.disabled && x.getClientRects().length);
      const first = elements[0], last = elements.at(-1);
      if (e.shiftKey && shadow.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && shadow.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  function enhance(list) {
    if (list.querySelector('[data-zcr-trigger]')) return;
    const button = document.createElement('button'); button.type = 'button'; button.dataset.zcrTrigger = 'true'; button.textContent = '✨'; button.title = 'Mở thêm reaction'; button.setAttribute('aria-label', button.title);
    button.style.cssText = 'border:0;border-radius:50%;background:#edf2ff;color:#315bda;font-size:22px;width:34px;height:34px;cursor:pointer;flex-shrink:0';
    button.addEventListener('pointerdown', e => { e.stopPropagation(); });
    button.onclick = e => { e.preventDefault(); e.stopPropagation(); open(list); }; list.append(button);
  }
  // Scan only after interaction; no observer over every Zalo DOM mutation.
  const launcher = document.createElement('button');
  launcher.textContent = '☺'; launcher.title = 'Reaction · mở menu reaction của tin nhắn trước';
  launcher.setAttribute('aria-label', launcher.title);
  launcher.style.cssText = 'position:fixed;right:20px;bottom:88px;width:38px;height:38px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;color:#3865ed;font:25px system-ui;cursor:pointer;box-shadow:0 2px 8px #0002;z-index:2147483645';
  shadow.append(launcher);
  const selector = '.reaction-emoji-list';
  launcher.onclick = () => {
    const list = [...document.querySelectorAll(selector)].find(el => el.getClientRects().length && findSender(el));
    open(list || null);
  };
  let scanTimer = null, lastScan = 0;
  function scheduleScan(event) {
    if (!(event.target instanceof Element) || event.target === host || !veil.hidden || scanTimer || performance.now() - lastScan < 250) return;
    scanTimer = setTimeout(() => {
      scanTimer = null; lastScan = performance.now();
      document.querySelectorAll(selector).forEach(enhance);
    }, 120);
  }
  document.addEventListener('pointerover', scheduleScan, { passive: true });
  document.addEventListener('click', scheduleScan, { passive: true });
  document.querySelectorAll(selector).forEach(enhance);
  if (location.protocol === 'file:' || ['localhost','127.0.0.1'].includes(location.hostname)) open(null, true);
})();
