---
title: "Índices no PostgreSQL na prática: lendo o EXPLAIN ANALYZE"
description: "Um roteiro direto para descobrir por que a query está lenta e qual índice resolve."
category: Banco de dados
tags: [postgresql, performance, sql]
---

Antes de criar um índice, **meça**. O `EXPLAIN ANALYZE` mostra o plano escolhido
pelo otimizador e quanto tempo cada etapa levou de verdade.

## Encontrando o gargalo

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, total
FROM pedidos
WHERE cliente_id = 42
  AND status = 'pago'
ORDER BY criado_em DESC
LIMIT 20;
```

Se aparecer `Seq Scan on pedidos` com milhões de linhas filtradas, há espaço
para um índice.

## Índice composto na ordem certa

Colunas de **igualdade** primeiro, depois a coluna de **ordenação**:

```sql
CREATE INDEX CONCURRENTLY idx_pedidos_cliente_status_data
  ON pedidos (cliente_id, status, criado_em DESC);
```

> Use `CONCURRENTLY` em produção para não bloquear escritas na tabela.
{: .tip }

## Conclusão

Meça, leia o plano, crie o índice que atende o filtro **e** a ordenação, e meça
de novo.
