---
title: "Deploy sem downtime no Kubernetes: readiness, preStop e graceful shutdown"
description: "Por que um rolling update ainda derruba requisições e as três configurações que resolvem isso de vez."
category: Infraestrutura
author: kaique
tags: [kubernetes, devops, sre]
---

Todo mundo já ouviu que o *rolling update* do Kubernetes faz deploy sem downtime.
Na prática, se você olhar os logs do load balancer durante um deploy, é bem
provável que encontre um punhado de `502` e `connection reset`. Neste artigo
vamos entender **de onde vêm esses erros** e como eliminá-los com três ajustes.

## O problema

Quando um pod é encerrado, duas coisas acontecem **em paralelo**:

1. O kubelet envia `SIGTERM` para o container.
2. O control plane remove o pod dos `Endpoints`, e cada nó atualiza suas regras de rede (kube-proxy, ingress etc.).

Como são assíncronos, existe uma janela em que o processo já está desligando,
mas o tráfego **ainda chega** até ele.

> **Resumo:** o pod morre antes de o resto do cluster saber que ele está morrendo.
{: .note }

## A solução em três partes

### 1. Readiness probe de verdade

A readiness probe diz ao Kubernetes quando o pod pode receber tráfego. Ela deve
verificar se a aplicação está realmente pronta, e não só se o processo subiu.

```yaml
readinessProbe:
  httpGet:
    path: /healthz/ready
    port: 8080
  periodSeconds: 5
  failureThreshold: 2
```

### 2. Um `preStop` para segurar o encerramento

O hook `preStop` roda **antes** do `SIGTERM`. Uma pausa curta dá tempo para a
remoção dos endpoints se propagar:

```yaml
lifecycle:
  preStop:
    exec:
      command: ["sleep", "10"]
terminationGracePeriodSeconds: 40
```

> **Atenção:** `terminationGracePeriodSeconds` conta a partir do início do
> `preStop`. Ele precisa ser maior que a pausa **mais** o tempo de shutdown da app.
{: .warning }

### 3. Graceful shutdown na aplicação

Ao receber `SIGTERM`, a aplicação deve parar de aceitar conexões novas e
terminar as que estão em andamento. Em Go, por exemplo:

```go
srv := &http.Server{Addr: ":8080", Handler: mux}

go func() {
    if err := srv.ListenAndServe(); err != http.ErrServerClosed {
        log.Fatal(err)
    }
}()

stop := make(chan os.Signal, 1)
signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)
<-stop

ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
defer cancel()
srv.Shutdown(ctx) // aguarda requisições em andamento
```

E em Node.js:

```javascript
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 25_000).unref();
});
```

## Validando

Rode um teste de carga enquanto faz o deploy e conte os erros:

```bash
hey -z 60s -c 20 https://api.exemplo.com/health &
kubectl rollout restart deployment/api
kubectl rollout status deployment/api
```

| Configuração                     | Erros durante o deploy |
|----------------------------------|-----------------------:|
| Padrão                           | 147                    |
| + readiness probe                | 61                     |
| + preStop                        | 3                      |
| + graceful shutdown              | **0**                  |

> **Dica:** deixe esse teste no pipeline de CI do ambiente de staging, assim
> qualquer regressão aparece antes de chegar em produção.
{: .tip }

## Conclusão

Deploy sem downtime não vem de graça. Ele depende da combinação de **probe
correta**, **pausa no `preStop`** e **shutdown gracioso** na aplicação. Com os
três no lugar, o rolling update finalmente faz o que promete.
