/* UG Online｜文章系統（這個檔案不需要修改）
   讀取 articles-data.js，自動產生：
   1. 首頁文章區（可切換分類）與公告列
   2. 所有文章列表（分類、分頁）
   3. 點文章 → 彈窗卡片（網址會變成 #a=文章代號，可以分享）
   4. 單篇文章完整頁：article.html?id=文章代號
   編輯文章請用 admin.html，改完發布後所有頁面會一起更新。 */
(function () {
  'use strict';
  var D = window.ARTICLES_DATA || {}, SITE = D.site || {};
  var ALL = (D.articles || []).filter(function (a) { return a && a.id && a.title && !a.draft; });
  var SHOW = SITE.showEmptySlots !== false;
  var NAME = SITE.name || 'UG Online';
  var CATS = (SITE.categories && SITE.categories.length) ? SITE.categories : ['遊戲攻略', '新手教學', '活動', '公告', '其他'];
  var HOME_N = +SITE.homeCount || 8;
  var NOTICE_CAT = SITE.noticeCategory || '公告';
  var each = function (sel, fn, root) { [].forEach.call((root || document).querySelectorAll(sel), fn); };

  /* ---------- 小工具 ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safe(u) { u = String(u || '').trim(); return /^(javascript|data|vbscript):/i.test(u) ? '' : u; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function find(id) { for (var i = 0; i < ALL.length; i++) if (ALL[i].id === id) return ALL[i]; return null; }
  function href(a) { return 'article.html?id=' + encodeURIComponent(a.id); }
  function latest() {
    return ALL.map(function (a, i) { return [a, i]; }).sort(function (x, y) {
      var d = String(y[0].date || '').localeCompare(String(x[0].date || ''));
      return d || x[1] - y[1];
    }).map(function (p) { return p[0]; });
  }
  function catsUsed() {
    var seen = {}, out = [];
    ALL.forEach(function (a) { if (a.category) seen[a.category] = 1; });
    CATS.forEach(function (c) { if (seen[c]) { out.push(c); delete seen[c]; } });
    Object.keys(seen).forEach(function (c) { out.push(c); });
    return out;
  }

  /* ---------- 內容排版（簡易 Markdown） ---------- */
  function inline(s) {
    s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return s.replace(/\[([^\]]+)\]\(([^)\s|]+)(\|sponsored)?\)/g, function (m, t, u, sp) {
      u = safe(u.replace(/&amp;/g, '&'));
      if (!u) return t;
      var ext = /^https?:/i.test(u);
      return '<a href="' + esc(u) + '"' + (ext ? ' target="_blank"' : '') + ' rel="' + (sp ? 'sponsored ' : '') + 'noopener">' + t + '</a>';
    });
  }
  function block(b) {
    if (!b) return '';
    var lines = b.split('\n'), m;
    if ((m = lines[0].match(/^(#{2,3})\s+(.+)$/)))
      return '<h' + m[1].length + '>' + inline(m[2]) + '</h' + m[1].length + '>' + (lines.length > 1 ? block(lines.slice(1).join('\n').trim()) : '');
    if (/^---+$/.test(b)) return '<hr>';
    if ((m = b.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)))
      return '<figure><img src="' + esc(safe(m[2])) + '" alt="' + esc(m[1]) + '" loading="lazy" decoding="async">' + (m[1] ? '<figcaption>' + esc(m[1]) + '</figcaption>' : '') + '</figure>';
    var all = function (re) { return lines.every(function (l) { return re.test(l); }); };
    if (all(/^[-*]\s+/)) return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^[-*]\s+/, '')) + '</li>'; }).join('') + '</ul>';
    if (all(/^\d+[.)]\s+/)) return '<ol>' + lines.map(function (l) { return '<li>' + inline(l.replace(/^\d+[.)]\s+/, '')) + '</li>'; }).join('') + '</ol>';
    if (all(/^>/)) return '<blockquote>' + lines.map(function (l) { return inline(l.replace(/^>\s?/, '')); }).join('<br>') + '</blockquote>';
    if (/^!!\s+/.test(b)) return '<div class="note">' + inline(b.replace(/^!!\s+/, '')).replace(/\n/g, '<br>') + '</div>';
    return '<p>' + lines.map(inline).join('<br>') + '</p>';
  }
  function markdown(src) {
    return String(src || '').replace(/\r/g, '').trim().split(/\n[ \t]*\n/).map(function (b) { return block(b.trim()); }).join('');
  }

  /* 單篇文章的內文區（彈窗、完整頁、後台預覽共用） */
  function articleInner(a) {
    var c = safe(a.cover);
    var text = String(a.body || '').replace(/[#>*!\-\[\]\(\)`]/g, ''), mins = Math.max(1, Math.round(text.length / 450));
    return '<p class="meta">' + (a.category ? '<span class="tag">' + esc(a.category) + '</span>' : '') +
      (a.date ? '<span>' + esc(a.date) + '</span>' : '') + '<span>約 ' + mins + ' 分鐘閱讀</span></p>' +
      '<h1>' + esc(a.title || '（尚未填標題）') + '</h1>' +
      (a.summary ? '<p class="lead">' + esc(a.summary) + '</p>' : '') +
      (c ? '<figure class="cover"><img src="' + esc(c) + '" alt="' + esc(a.coverAlt || a.title || '') + '" decoding="async"></figure>' : '') +
      '<div class="post-body">' + markdown(a.body) + '</div>';
  }

  /* ---------- 卡片 ---------- */
  function thumb(a, ratio) {
    var c = safe(a.cover);
    return '<div class="thumb">' + (c
      ? '<img src="' + esc(c) + '" alt="' + esc(a.coverAlt || a.title) + '" loading="lazy" decoding="async">'
      : '<div class="ph img" style="aspect-ratio:' + (ratio || '3/2') + '">' + esc(NAME) + '</div>') + '</div>';
  }
  function card(a) {
    return '<a class="card media" href="' + href(a) + '" data-aid="' + esc(a.id) + '">' + thumb(a) + '<div class="body"><p class="meta">' +
      (a.category ? '<span class="tag">' + esc(a.category) + '</span>' : '') +
      (a.date ? '<span>' + esc(a.date) + '</span>' : '') + '</p><h3>' + esc(a.title) + '</h3>' +
      '<p class="sum">' + esc(a.summary || '') + '</p><span class="go">閱讀全文</span></div></a>';
  }
  function emptyCard(n) {
    return '<div class="card media empty" aria-hidden="true"><div class="thumb"><div class="ph img" style="aspect-ratio:3/2">【文章 ' + pad(n) + ' 封面 900×600】</div></div>' +
      '<div class="body"><p class="meta"><span class="ph t">【分類】</span><span class="ph t">【日期】</span></p><h3>【文章 ' + pad(n) + ' 標題】</h3>' +
      '<p class="ph block">【文章摘要 40～60 字】</p></div></div>';
  }
  function gcard(a) {
    var c = safe(a.cover);
    return '<a class="gcard" href="' + href(a) + '" data-aid="' + esc(a.id) + '"><span class="gimg">' +
      (c ? '<img src="' + esc(c) + '" alt="' + esc(a.coverAlt || a.title) + '" loading="lazy" decoding="async">' : '') +
      '</span><span class="gt"><i></i><b>' + esc(a.title) + '</b></span></a>';
  }
  function gempty(n) {
    return '<div class="gcard" aria-hidden="true"><span class="gimg"></span><span class="gt"><i></i><b>【文章標題 ' + n + '】</b></span></div>';
  }
  function pager(el, page, pages, cat) {
    if (!el) return;
    if (pages < 2) { el.innerHTML = ''; return; }
    var u = function (p) {
      var q = [];
      if (cat) q.push('cat=' + encodeURIComponent(cat));
      if (p > 1) q.push('page=' + p);
      return location.pathname + (q.length ? '?' + q.join('&') : '');
    }, h = '';
    if (page > 1) h += '<a class="btn line" href="' + u(page - 1) + '">上一頁</a>';
    for (var p = 1; p <= pages; p++) h += '<a class="chip"' + (p === page ? ' aria-current="page"' : '') + ' href="' + u(p) + '">' + p + '</a>';
    if (page < pages) h += '<a class="btn blue" href="' + u(page + 1) + '">下一頁</a>';
    el.innerHTML = h;
  }

  /* ---------- 1. 所有文章列表（卡片 + 分類 + 分頁） ---------- */
  each('[data-articles]', function (box) {
    var fixed = box.getAttribute('data-category'), limit = +box.getAttribute('data-limit') || 0, per = +box.getAttribute('data-per') || 0;
    var cat = box.hasAttribute('data-cat-param') ? (new URLSearchParams(location.search).get('cat') || '') : '';
    var items = latest();
    if (fixed) { var cs = fixed.split('|'); items = items.filter(function (a) { return cs.indexOf(a.category) > -1; }); }
    if (cat) items = items.filter(function (a) { return a.category === cat; });
    var total = items.length, page = 1, pages = 1, slots = limit || per, html = '';
    if (per) {
      pages = Math.max(1, Math.ceil(total / per));
      page = Math.min(pages, Math.max(1, parseInt(new URLSearchParams(location.search).get('page'), 10) || 1));
      items = items.slice((page - 1) * per, page * per);
    } else if (limit) items = items.slice(0, limit);
    items.forEach(function (a) { html += card(a); });
    if (SHOW && !cat && page === 1 && slots) {
      /* 空白版位：列表頁只在完全沒有文章時顯示 8 張；其餘區塊補到指定張數 */
      var fill = per ? (total === 0 ? 8 : 0) : slots;
      for (var n = items.length; n < fill; n++) html += emptyCard(n + 1);
    }
    if (!html) {
      if (box.hasAttribute('data-hide-empty')) { var sec = box.closest('section'); if (sec) sec.hidden = true; }
      else html = '<p class="muted">' + (cat ? '此分類文章即將上架，敬請期待。' : '文章即將上架，敬請期待。') + '</p>';
    }
    box.innerHTML = html;
    var nx = box.nextElementSibling;
    if (nx && nx.hasAttribute('data-pager')) pager(nx, page, pages, cat);
  });

  each('[data-cat-chips]', function (box) {
    var used = catsUsed(), cur = new URLSearchParams(location.search).get('cat') || '';
    if (!used.length) { box.hidden = true; return; }
    var mk = function (label, c) {
      return '<a class="chip" href="' + location.pathname + (c ? '?cat=' + encodeURIComponent(c) : '') + '"' + ((c || '') === cur ? ' aria-current="page"' : '') + '>' + esc(label) + '</a>';
    };
    box.innerHTML = mk('全部', '') + used.map(function (c) { return mk(c, c); }).join('');
  });

  /* ---------- 2. 首頁：文章區（分類切換）+ 公告列 ---------- */
  each('[data-home-grid]', function (grid) {
    var panel = grid.closest('.gpanel') || document, chips = panel.querySelector('[data-home-chips]'), cur = '';
    function homeCats() {
      var u = catsUsed();
      return (!u.length && SHOW) ? CATS.filter(function (c) { return c !== '其他'; }) : u;
    }
    function drawChips() {
      if (!chips) return;
      var mk = function (label, c) {
        return '<a class="chip" href="#" role="button" data-cat="' + esc(c) + '"' + (c === cur ? ' aria-current="true"' : '') + '>' + esc(label) + '</a>';
      };
      chips.innerHTML = mk('全部', '') + homeCats().map(function (c) { return mk(c, c); }).join('');
    }
    function draw() {
      var items = latest().filter(function (a) { return !cur || a.category === cur; }).slice(0, HOME_N), html = '';
      items.forEach(function (a) { html += gcard(a); });
      if (SHOW && !cur) for (var n = items.length; n < HOME_N; n++) html += gempty(n + 1);
      if (!html) html = '<p class="muted" style="grid-column:1/-1;text-align:center;padding:24px 0">此分類文章即將上架</p>';
      grid.innerHTML = html;
    }
    if (chips) chips.addEventListener('click', function (e) {
      var el = e.target.closest('[data-cat]');
      if (!el) return;
      e.preventDefault();
      cur = el.getAttribute('data-cat');
      drawChips(); draw();
    });
    drawChips(); draw();
  });

  each('[data-notice]', function (el) {
    var n = latest().filter(function (a) { return a.category === NOTICE_CAT; })[0];
    if (!n) return;
    var t = el.querySelector('.ntxt');
    if (t) t.textContent = n.title;
    el.href = href(n);
    el.setAttribute('data-aid', n.id);
  });

  /* ---------- 3. 彈窗卡片 ---------- */
  var root = document.getElementById('article-root');
  var modal = null, hideTimer = 0, lastFocus = null;
  var CSS =
    '.ugm{position:fixed;inset:0;z-index:1000;display:flex;align-items:flex-end;justify-content:center}' +
    '.ugm[hidden]{display:none}' +
    '.ugm-scrim{position:absolute;inset:0;background:rgba(8,24,60,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .25s}' +
    '.ugm.on .ugm-scrim{opacity:1}' +
    '.ugm-card{position:relative;width:100%;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;background:#fff;color:#1b2a47;border-radius:26px 26px 0 0;box-shadow:0 -20px 60px -20px rgba(8,24,60,.6);transform:translateY(40px);opacity:0;transition:transform .3s cubic-bezier(.2,.8,.2,1),opacity .25s;outline:0}' +
    '.ugm.on .ugm-card{transform:none;opacity:1}' +
    '.ugm-x{position:absolute;top:10px;right:10px;z-index:2;width:40px;height:40px;border-radius:50%;border:0;display:grid;place-items:center;background:#eaf3ff;color:#1b2a47;box-shadow:0 6px 14px -6px rgba(10,40,100,.5);cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    '.ugm-x:active{transform:scale(.92)}' +
    '.ugm-x svg{width:18px;height:18px}' +
    '.ugm-scroll{overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:24px 20px calc(26px + env(safe-area-inset-bottom))}' +
    '.ugm-scroll .post{max-width:none;padding:0;margin:0}' +
    '.ugm-scroll .post h1{font-size:clamp(1.35rem,4.5vw,1.9rem);line-height:1.3;margin:.25em 0 .5em;padding-right:34px}' +
    '.ugm-foot{margin-top:28px;display:flex;justify-content:center}' +
    'html.ugm-lock,html.ugm-lock body{overflow:hidden}' +
    '@media(min-width:700px){.ugm{align-items:center;padding:24px}.ugm-card{max-width:780px;border-radius:26px;box-shadow:0 30px 80px -20px rgba(8,24,60,.65)}.ugm-scroll{padding:36px 40px 32px}}' +
    '@media(prefers-color-scheme:dark){.ugm-card{background:#121f3a;color:#e8f0ff}.ugm-x{background:#233a63;color:#e8f0ff}}' +
    '@media(prefers-reduced-motion:reduce){.ugm-card,.ugm-scrim{transition:none}}';

  function ensureModal() {
    if (modal) return modal;
    var st = document.createElement('style'); st.id = 'ugm-style'; st.textContent = CSS; document.head.appendChild(st);
    modal = document.createElement('div');
    modal.className = 'ugm'; modal.hidden = true;
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-label', '文章內容');
    modal.innerHTML = '<div class="ugm-scrim" data-close></div><div class="ugm-card" tabindex="-1">' +
      '<button type="button" class="ugm-x" data-close aria-label="關閉"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
      '<div class="ugm-scroll"></div></div>';
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
    document.body.appendChild(modal);
    return modal;
  }
  function showModal(a) {
    var m = ensureModal();
    clearTimeout(hideTimer);
    var sc = m.querySelector('.ugm-scroll');
    sc.innerHTML = '<article class="post">' + articleInner(a) + '</article>' +
      '<div class="ugm-foot"><a class="btn line" href="' + href(a) + '">開啟完整頁面</a></div>';
    sc.scrollTop = 0;
    m.hidden = false;
    document.documentElement.classList.add('ugm-lock');
    requestAnimationFrame(function () { m.classList.add('on'); m.querySelector('.ugm-card').focus({ preventScroll: true }); });
  }
  function hideModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('on');
    document.documentElement.classList.remove('ugm-lock');
    hideTimer = setTimeout(function () { modal.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }
  function openArticle(id) {
    var a = find(id);
    if (!a) return false;
    lastFocus = document.activeElement;
    showModal(a);
    try { history.pushState({ ugm: 1 }, '', '#a=' + encodeURIComponent(id)); } catch (e) {}
    return true;
  }
  function closeModal() {
    if (history.state && history.state.ugm) { history.back(); return; }
    hideModal();
    if (/^#a=/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
  }
  function syncFromHash() {
    var m = location.hash.match(/^#a=(.+)$/), a = m && find(decodeURIComponent(m[1]));
    if (a) showModal(a); else hideModal();
  }
  if (!root) {
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var el = e.target.closest && e.target.closest('a[data-aid]');
      if (el && openArticle(el.getAttribute('data-aid'))) e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
      if (!modal || modal.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key === 'Tab') {
        var f = [].filter.call(modal.querySelectorAll('a[href],button'), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === modal.querySelector('.ugm-card'))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();
  }

  /* ---------- 4. 單篇文章完整頁 ---------- */
  if (root) {
    var id = new URLSearchParams(location.search).get('id'), a = find(id);
    if (!a) {
      document.title = '找不到文章｜' + NAME;
      root.innerHTML = '<section class="sec"><div class="wrap post"><h1>找不到這篇文章</h1><p>這篇文章可能已經移除，或網址有誤。</p><p><a class="btn blue" href="articles.html">回文章列表</a></p></div></section>';
    } else {
      var list = latest(), i = list.indexOf(a), prev = list[i - 1], next = list[i + 1];
      var pn = function (x, label, cls) {
        return x ? '<a class="' + cls + '" href="' + href(x) + '"><small>' + label + '</small><b>' + esc(x.title) + '</b></a>' : '<span></span>';
      };
      var rel = latest().filter(function (x) { return x !== a; });
      rel = rel.filter(function (x) { return x.category === a.category; }).concat(rel.filter(function (x) { return x.category !== a.category; })).slice(0, 3);
      var c = safe(a.cover);
      root.innerHTML =
        '<article class="wrap post" style="padding:28px 20px 56px">' +
        '<p class="crumb muted"><a href="index.html">首頁</a> / <a href="articles.html">所有文章</a> / ' + esc(a.title) + '</p>' +
        articleInner(a) +
        '<nav class="pn" aria-label="上下篇">' + pn(prev, '較新文章', 'prevn') + pn(next, '較舊文章', 'nextn') + '</nav>' +
        '<p><a class="btn line" href="articles.html">回文章列表</a></p>' +
        '</article>' +
        (rel.length ? '<section class="sec alt"><div class="wrap"><div class="sec-head"><div><h2>延伸閱讀</h2></div><a class="more" href="articles.html">更多文章</a></div><div class="grid g3">' + rel.map(card).join('') + '</div></div></section>' : '');

      /* 網頁標題、搜尋描述、分享資訊、結構化資料 */
      document.title = a.title + '｜' + NAME;
      var meta = function (sel, v) { var m = document.querySelector(sel); if (m) m.setAttribute('content', v); };
      var url = location.origin + location.pathname + '?id=' + encodeURIComponent(a.id);
      meta('meta[name="description"]', a.summary || '');
      meta('meta[property="og:title"]', a.title);
      meta('meta[property="og:description"]', a.summary || '');
      meta('meta[property="og:url"]', url);
      if (c) meta('meta[property="og:image"]', new URL(c, location.href).href);
      var cn = document.createElement('link'); cn.rel = 'canonical'; cn.href = url; document.head.appendChild(cn);
      var ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.summary || undefined,
        image: c ? new URL(c, location.href).href : undefined, datePublished: a.date || undefined, dateModified: a.updated || a.date || undefined,
        author: { '@type': 'Person', name: a.author || SITE.author || NAME }, publisher: { '@type': 'Organization', name: NAME }, mainEntityOfPage: url };
      var sc = document.createElement('script'); sc.type = 'application/ld+json'; sc.textContent = JSON.stringify(ld); document.head.appendChild(sc);
    }
  }

  /* 給後台預覽使用 */
  window.UGArticles = { markdown: markdown, articleInner: articleInner, esc: esc };
})();
