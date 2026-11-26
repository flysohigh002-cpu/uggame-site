/* 首頁文章卡片：自動讀取 articles-data.js，顯示封面與標題，點擊進入該篇文章。
   分類標籤可直接在首頁篩選。新增或修改文章只要改 articles-data.js，不用動首頁。 */
(function () {
  function run() {
    var D = window.ARTICLES_DATA;
    var panel = document.querySelector('.gpanel');
    if (!D || !panel) return;

    var st = document.createElement('style');
    st.textContent = '.gcard[hidden]{display:none}.gempty{margin:18px 0 6px;text-align:center;color:var(--muted);font-weight:700}.gempty[hidden]{display:none}.gt b{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.35;font-size:.92rem}';
    document.head.appendChild(st);
    var grids = panel.querySelectorAll('.ggrid');
    if (!grids.length) return;

    var list = (D.articles || []).filter(function (a) { return a && !a.draft; });
    list = list.map(function (a, i) { return { a: a, i: i }; }).sort(function (x, y) {
      var d = String(y.a.date || '').localeCompare(String(x.a.date || ''));
      return d || x.i - y.i;
    }).map(function (o) { return o.a; });
    var max = (D.site && Number(D.site.homeCount)) || 8;
    list = list.slice(0, max);

    var grid = grids[0];
    for (var g = 1; g < grids.length; g++) grids[g].parentNode.removeChild(grids[g]);
    grid.innerHTML = '';

    list.forEach(function (a) {
      var card = document.createElement('a');
      card.className = 'gcard';
      card.href = 'article.html?id=' + encodeURIComponent(a.id);
      card.setAttribute('data-cat', a.category || '');
      var img = document.createElement('span');
      img.className = 'gimg';
      if (a.cover) {
        var im = document.createElement('img');
        im.src = a.cover;
        im.alt = a.coverAlt || a.title || '';
        im.loading = 'lazy';
        im.decoding = 'async';
        img.appendChild(im);
      }
      var t = document.createElement('span');
      t.className = 'gt';
      t.appendChild(document.createElement('i'));
      var b = document.createElement('b');
      b.textContent = a.title || '';
      t.appendChild(b);
      card.appendChild(img);
      card.appendChild(t);
      grid.appendChild(card);
    });

    var empty = document.createElement('p');
    empty.className = 'gempty';
    empty.textContent = '此分類目前沒有文章';
    empty.hidden = true;
    grid.parentNode.insertBefore(empty, grid.nextSibling);

    var chips = panel.querySelectorAll('.cats .chip');
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        var name = chip.textContent.trim();
        Array.prototype.forEach.call(chips, function (c) { c.removeAttribute('aria-current'); });
        chip.setAttribute('aria-current', 'page');
        var shown = 0;
        Array.prototype.forEach.call(grid.children, function (c) {
          var ok = name === '全部' || c.getAttribute('data-cat') === name;
          c.hidden = !ok;
          if (ok) shown++;
        });
        empty.hidden = shown > 0;
      });
    });
  }

  function start() {
    if (window.ARTICLES_DATA) return run();
    var s = document.createElement('script');
    s.src = 'articles-data.js';
    s.onload = run;
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
