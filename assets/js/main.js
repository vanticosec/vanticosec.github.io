(function () {
  var root = document.documentElement;

  // ---- tema claro/escuro ----
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
  });

  // ---- filtro por tag na home ----
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
      document.querySelectorAll('.grid .card').forEach(function (card) {
        var tags = (card.dataset.tags || '').split(' ');
        card.hidden = f !== '*' && tags.indexOf(f) === -1;
      });
    });
  });

  // ---- blocos de código: rótulo da linguagem + botão copiar ----
  document.querySelectorAll('.prose div.highlighter-rouge').forEach(function (block) {
    var lang = (block.className.match(/language-(\S+)/) || [])[1];
    if (lang && lang !== 'plaintext') {
      var label = document.createElement('span');
      label.className = 'code-lang';
      label.textContent = lang;
      block.appendChild(label);
    }
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'copiar';
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(block.querySelector('code').innerText).then(function () {
        btn.textContent = 'copiado ✓';
        btn.classList.add('ok');
        setTimeout(function () { btn.textContent = 'copiar'; btn.classList.remove('ok'); }, 1600);
      });
    });
    block.appendChild(btn);
  });

  // ---- sumário (TOC) gerado a partir dos h2/h3 ----
  var toc = document.getElementById('toc');
  var headings = document.querySelectorAll('.prose h2[id], .prose h3[id]');
  if (toc) {
    if (headings.length < 2) {
      toc.closest('.toc').style.visibility = 'hidden';
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
      }, { rootMargin: '-80px 0px -70% 0px' });
      headings.forEach(function (h) { spy.observe(h); });
    }
  }

  // ---- barra de progresso de leitura ----
  var bar = document.querySelector('.progress span');
  if (bar) {
    var update = function () {
      var max = document.body.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    };
    addEventListener('scroll', update, { passive: true });
    update();
  }
})();
