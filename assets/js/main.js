(function () {
  var root = document.documentElement;

  // ---- tema claro/escuro ----
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  // ---- menu lateral no mobile ----
  var menuBtn = document.querySelector('.menu-toggle');
  var backdrop = document.querySelector('.backdrop');
  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    backdrop.hidden = !open;
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!document.body.classList.contains('nav-open')); });
    backdrop.addEventListener('click', function () { setMenu(false); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // ---- busca (índice gerado em /search.json) ----
  var input = document.getElementById('search');
  var results = document.getElementById('search-results');
  var index = null;
  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch(input.dataset.index)
      .then(function (r) { return r.json(); })
      .then(function (data) { index = data; return data; });
  }
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function render(items, q) {
    results.innerHTML = '';
    if (!items.length) {
      results.innerHTML = '<p class="search-empty">Nada encontrado.</p>';
    }
    items.slice(0, 8).forEach(function (it) {
      var a = document.createElement('a');
      a.href = it.url;
      var kind = document.createElement('small');
      kind.textContent = it.kind;
      var title = document.createElement('span');
      title.textContent = it.title;
      a.appendChild(kind);
      a.appendChild(title);
      results.appendChild(a);
    });
    results.hidden = !q;
  }
  if (input) {
    input.addEventListener('focus', loadIndex, { once: true });
    input.addEventListener('input', function () {
      var q = norm(input.value.trim());
      if (!q) { results.hidden = true; return; }
      loadIndex().then(function (data) {
        var terms = q.split(/\s+/);
        var hits = data.map(function (d) {
          var t = norm(d.title), body = norm(d.text);
          var ok = terms.every(function (w) { return t.indexOf(w) > -1 || body.indexOf(w) > -1; });
          if (!ok) return null;
          var score = terms.reduce(function (s, w) { return s + (t.indexOf(w) > -1 ? 10 : 1); }, 0);
          return { d: d, score: score };
        }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
        render(hits.map(function (h) { return h.d; }), q);
      });
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var first = results.querySelector('a'); if (first) location.href = first.href; }
      if (e.key === 'Escape') { input.value = ''; results.hidden = true; input.blur(); }
    });
    // atalho "/" para focar a busca
    addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (window.innerWidth < 860) setMenu(true);
        input.focus();
      }
    });
  }

  // ---- blocos de código: rótulo da linguagem + botão copiar ----
  document.querySelectorAll('.prose div.highlighter-rouge').forEach(function (block) {
    var lang = (block.className.match(/language-(\S+)/) || [])[1];
    var bar = document.createElement('div');
    bar.className = 'code-bar';
    var label = document.createElement('span');
    label.textContent = lang && lang !== 'plaintext' && lang !== 'text' ? lang : '';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copiar';
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(block.querySelector('code').innerText).then(function () {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = 'Copiar'; }, 1500);
      });
    });
    bar.appendChild(label);
    bar.appendChild(btn);
    block.insertBefore(bar, block.firstChild);
  });

  // ---- sumário (TOC) gerado a partir dos h2/h3 ----
  var toc = document.getElementById('toc');
  var headings = document.querySelectorAll('.prose h2[id], .prose h3[id]');
  if (toc) {
    if (headings.length < 2) {
      toc.closest('.toc').hidden = true;
    } else {
      headings.forEach(function (h) {
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        a.className = 'lvl-' + h.tagName[1];
        toc.appendChild(a);
      });
      var links = toc.querySelectorAll('a');
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-70px 0px -70% 0px' });
      headings.forEach(function (h) { spy.observe(h); });
    }
  }
})();
