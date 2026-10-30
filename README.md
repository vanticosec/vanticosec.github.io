# Vantico Tech — artigos e wiki

Site estático em [Jekyll](https://jekyllrb.com), publicado gratuitamente pelo GitHub Pages.

## Escrever um artigo

Crie `_posts/AAAA-MM-DD-titulo-do-artigo.md`:

```markdown
---
title: "Título do artigo"
description: "Resumo de uma linha (aparece na lista e no SEO)."
category: Infraestrutura
author: kaique          # chave definida em _config.yml > authors
---

Texto em Markdown...

> **Dica:** callouts com `{: .tip }`, `{: .note }` ou `{: .warning }` na linha seguinte.
{: .tip }
```

## Escrever na wiki

A wiki fica em `_wiki/`. Cada seção é um arquivo `.md` na raiz de `_wiki/` com uma
pasta de mesmo nome para as páginas:

```text
_wiki/
  web.md                 → /wiki/web/          (página da seção)
  web/
    sql-injection.md     → /wiki/web/sql-injection/
```

```markdown
---
title: SQL Injection
description: "Uma linha; aparece no índice da seção."
order: 1                # posição no menu lateral
---
```

O menu lateral, o índice da wiki e a busca são gerados automaticamente.

## Rodar localmente

Requer Ruby ≥ 3.0 (`brew install ruby`):

```bash
bundle install
bundle exec jekyll serve --livereload
# http://localhost:4000
```

## Publicar no GitHub Pages

O site é publicado em https://vanticosec.github.io a partir do repositório
`vanticosec/vanticosec.github.io` (o nome `<org>.github.io` faz o Pages servir na raiz).

1. Em **Settings → Pages**, escolha *Deploy from a branch* → `main` / `/ (root)`.
2. Em `_config.yml`: `url: https://vanticosec.github.io` e `baseurl: ""`.
   - Se o repositório tiver outro nome (ex.: `vanticosec/blog`), o site fica em
     `vanticosec.github.io/blog/` e é preciso usar `baseurl: /blog`.
3. **Domínio próprio (opcional):** crie um arquivo `CNAME` com o domínio
   (ex.: `tech.vantico.com.br`), aponte no DNS `CNAME tech → vanticosec.github.io`
   e marque *Enforce HTTPS*. Atualize `url` no `_config.yml`.

## Personalizar o visual

Identidade da Vantico: azul `#1C51C6`, fonte Satoshi (texto) e JetBrains Mono
(código). O tema segue o do sistema; o botão no topo alterna entre claro e escuro.

Cores, fontes e larguras ficam nas variáveis do topo de `assets/css/main.css`
(`--accent`, `--bg`, `--text`, `--sidebar-w`, `--content-w`…), com um bloco para cada tema.
O logo (`assets/img/logo.svg`) é o "V" do site da Vantico.

Callouts (artigos e wiki): `> texto` seguido de `{: .note }`, `{: .tip }` ou `{: .warning }`.
