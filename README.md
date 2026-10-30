# Vantico Tech — blog técnico

Site estático em [Jekyll](https://jekyllrb.com), publicado gratuitamente pelo GitHub Pages.

## Escrever um artigo

Crie `_posts/AAAA-MM-DD-titulo-do-artigo.md`:

```markdown
---
title: "Título do artigo"
description: "Resumo de uma linha (aparece no card e no SEO)."
category: Infraestrutura
author: kaique          # chave definida em _config.yml > authors
tags: [kubernetes, devops]
---

Texto em Markdown...

> **Dica:** callouts com `{: .tip }`, `{: .note }` ou `{: .warning }` na linha seguinte.
{: .tip }
```

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

Identidade da Vantico: azul `#2B6BE6`/`#1C51C6`, fonte Satoshi (títulos/texto) e
JetBrains Mono (rótulos e código). O tema escuro é o padrão; o botão no topo alterna
para o claro.

Cores, fontes e espaçamentos ficam nas variáveis do topo de `assets/css/main.css`
(`--brand`, `--accent`, `--bg`, `--text`…), com um bloco para cada tema.
O logo (`assets/img/logo.svg`) é o "V" do site da Vantico.

Callouts nos posts: `> texto` seguido de `{: .note }`, `{: .tip }` ou `{: .warning }`.
