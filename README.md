# Neo Crédito — Teste Técnico Front End

Projeto desenvolvido como parte do processo seletivo para a vaga de Desenvolvedor Front End, focado no módulo de Assinatura Eletrônica do portal interno de operações.

> [!IMPORTANT]
> <h3> Registro do Processo, Escolhas e Decisões de Projeto de Desenvolvimento</h3>
>
>Todas as escolhas de arquitetura, bibliotecas e padrões, assim como o registro do progresso de cada commit serão documentadas no arquivo [**DEV_CHOICES.md**](https://github.com/j-fborges/neocredito/blob/main/DEV_CHOICES.md).
>Lá você encontra justificativas completas alinhadas aos critérios de avaliação.
>
> **ATENÇÃO: A MOCKAGEM DA API SÓ FUNCIONA EM AMBIENTE DE DESENVOLVIMENTO**
>

## Contexto do desafio
Implementar duas user stories em uma única aplicação coesa:
- US-01: Painel de Acompanhamento do CORBAN
- US-02: Validação do Dossiê de Assinatura

### US-01: Painel de Acompanhamento do CORBAN

Diagrama de relações entre Atores, ações e Painel de Acompanhamento do CORBAN:

```mermaid
sequenceDiagram
    actor O as Operação
    actor C as CORBAN
    actor Cl as Cliente
    participant S as Sistema<br>(Painel de Acompanhamento do CORBAN)

    Note over O, S: INÍCIO US-01 // Fase de geração do link
    activate O
    O->>S: Gera link para Assinatura para proposta/CORBAN #123
    deactivate O
    activate S
    S-->>O: Link gerado
    deactivate S
    activate O

    O->>C: Envia link para Assinatura
    deactivate O
    activate C
    Note over O,C: O CORBAN recebe o link<br>Status: Aguardando assinatura.


    C->>Cl: Contata cliente e repassa o link
    deactivate C
    activate Cl
    loop Tentativas de contato
        C->>Cl: Envia link
    end
    Note over C,S: Log de Tentativas de Contato

    Cl-->>S: Acessa link e assina (ou recusa, ou expira)
    deactivate Cl

    activate S
    opt Cliente assina com sucesso
        Cl->>S: Realiza assinatura eletrônica
        S->>S: Atualiza status → "Assinado"
        S-->>C: Painel CORBAN: notificação visual + badge
    end

    opt Cliente recusa ou ocorre falha
        Cl->>S: Recusa / falha
        S->>S: Atualiza status → "Recusado"
        S-->>C: Painel CORBAN: badge de recusa
    end

    opt Link expira sem ação
        S->>S: Timeout → status "Expirado"
        S-->>C: Painel CORBAN: badge de expirado
    end

    Note over C, S: CORBAN visualiza status em tempo real sem necessidade de contatar a Operação

    S->>O: Atualização automática da Operação
    deactivate S
    activate O
    Note over S, O: FIM US-01 // Proposta segue automaticamente para esteira de análise

    O->>O: INÍCIO US-02
    deactivate O
```

## Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- MSW
- React Router
