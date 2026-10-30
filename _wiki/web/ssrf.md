---
title: Server-Side Request Forgery (SSRF)
description: Fazer o servidor enviar requisições para destinos escolhidos pelo atacante.
order: 3
---

## O que é

A aplicação busca uma URL informada pelo usuário (preview de link, webhook,
importação por URL, geração de PDF). O atacante aponta essa URL para serviços
internos que não deveriam ser acessíveis de fora.

## Como identificar

Procure parâmetros que recebem URL ou host (`url=`, `callback=`, `webhook=`,
`image=`) e aponte para um servidor seu para confirmar a requisição de saída.

Depois, teste destinos internos:

```text
http://127.0.0.1:8080/
http://localhost/admin
http://169.254.169.254/latest/meta-data/        # metadados AWS (IMDSv1)
http://metadata.google.internal/computeMetadata/v1/   # GCP, exige header
```

Se houver filtro, tente representações alternativas do mesmo endereço:

```text
http://2130706433/          # 127.0.0.1 em decimal
http://0x7f000001/          # em hexadecimal
http://[::1]/               # IPv6 loopback
```

E redirecionamentos a partir de um domínio permitido, além de DNS que resolve para IP interno.

## Mitigação

- **Allowlist** de destinos (domínios e esquemas); bloquear não é suficiente.
- Validar o IP **depois** da resolução DNS e em cada redirecionamento.
- Isolar o serviço que faz requisições de saída da rede interna.
- Na AWS, exigir **IMDSv2** (`HttpTokens=required`).
