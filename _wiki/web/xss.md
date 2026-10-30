---
title: Cross-Site Scripting (XSS)
description: Execução de JavaScript no navegador de outro usuário.
order: 2
---

## O que é

A aplicação devolve entrada do usuário na página sem o encoding adequado para o
contexto, e o navegador a interpreta como código.

| Tipo | Onde o payload fica |
|---|---|
| Refletido | Na própria requisição (ex.: parâmetro da URL) |
| Armazenado | No servidor (comentário, perfil, nome de arquivo) |
| DOM-based | Processado só no cliente, por JavaScript da página |

## Como identificar

Envie uma string única (ex.: `vnt1234`) e procure onde ela aparece na resposta.
O **contexto** define o payload:

```html
<!-- dentro do HTML -->
<img src=x onerror=alert(document.domain)>

<!-- dentro de um atributo -->
" autofocus onfocus=alert(document.domain) x="

<!-- dentro de uma string JavaScript -->
';alert(document.domain);//
```

Para DOM XSS, procure fontes (`location.hash`, `location.search`, `postMessage`)
chegando em sinks como `innerHTML`, `document.write` e `eval`.

> Use `alert(document.domain)` em vez de `alert(1)`: ele mostra em qual origem o
> código realmente executou.
{: .note }

## Mitigação

- **Output encoding** de acordo com o contexto (HTML, atributo, JS, URL). Prefira
  frameworks que fazem isso por padrão e evite `innerHTML`/`dangerouslySetInnerHTML`.
- **Content Security Policy** restritiva, sem `unsafe-inline`.
- Cookies de sessão com `HttpOnly`, para reduzir o impacto.
