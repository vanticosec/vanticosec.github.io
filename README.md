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

1. Crie um repositório (ex.: `vantico/tech-blog`) e faça push deste conteúdo.
2. Em **Settings → Pages**, escolha *Deploy from a branch* → `main` / `/ (root)`.
3. **Domínio próprio:** o arquivo `CNAME` já aponta para `tech.vantico.com.br`.
   Crie no DNS um registro `CNAME tech → vantico.github.io` e marque *Enforce HTTPS*.
   - Sem domínio próprio? Apague o `CNAME` e em `_config.yml` use
     `url: https://vantico.github.io` e `baseurl: /tech-blog`.

## Personalizar o visual

Cores, fontes e espaçamentos ficam nas variáveis do topo de `assets/css/main.css`
(`--accent`, `--bg`, `--text`…), com um bloco para o tema claro e outro para o escuro.
Troque `assets/img/logo.svg` pelo logo oficial.
