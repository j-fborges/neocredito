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

## 1. Contexto do desafio

Implementar duas user stories em uma única aplicação coesa:
- US-01: Painel de Acompanhamento do CORBAN
- US-02: Validação do Dossiê de Assinatura

### 1.1. Diagramas de relações entre Atores, Ações e Eventos das User Stories

### 1.1.1. US-01: Painel de Acompanhamento do CORBAN

Diagrama de relações entre Atores, Ações e Eventos e Painel de Acompanhamento do CORBAN:

```mermaid
sequenceDiagram
    actor O as Operação
    actor C as CORBAN
    actor Cl as Cliente
    participant S as Sistema<br>(Painel de Acompanhamento do CORBAN)

    activate S
    activate O
    O->>S: Gera link para Assinatura para proposta/CORBAN #123
    deactivate O
    S-->>O: Link gerado
    deactivate S
    activate O

    O->>C: Envia link para Assinatura
    deactivate O
    activate C
    Note over O, C: O CORBAN recebe o link<br>Status: Aguardando assinatura.

    C->>S: Acessa o Painel de Acompanhamento
    Note over O, S: INÍCIO US-01
    activate S
    S-->>C: Exibe listagem de propostas com as informações:<br>• Número da proposta,<br>• Nome do Cliente,<br>• Status da assinatura,<br>• Data/Hora último evento de assinatura

    Note over C, S: O CORBAN pode filtrar por status,<br>buscar por nome do cliente ou nº da proposta

    C->>S: Clica na proposta para ver detalhes
    activate S
    Note over S,C: Abre painel de detalhes:<br>• Link gerado<br>• Data de envio<br>• Log de tentativas de contato (Qual o conteúdo do log???)
    S-->>C:
    deactivate S

    C->>Cl: Contata cliente e repassa o link (WhatsApp, SMS, E-mail ?? Qual o meio de contato???)
    deactivate C
    activate Cl
    loop Tentativas de contato
        C->>Cl: Envia link
        C->>S: CORBAN Atualiza log???
    end
    Note over C, S: Log de Tentativas de Contato visível no painel de detalhes

    Cl-->>S: Acessa link e assina (ou recusa, ou expira)
    deactivate Cl

    activate S
    opt Cliente assina com sucesso
        Cl->>S: Realiza assinatura eletrônica
        S->>S: Atualiza status → "Assinado"
        S-->>C: Painel CORBAN: notificação visual + badge (em tempo real)
    end

    opt Cliente recusa
        Cl->>S: Recusa
        S->>S: Atualiza status → "Recusado"
        S-->>C: Painel CORBAN: badge de recusa
    end

    opt Assinatura expira sem ação
        S->>S: Timeout → status "Expirado"
        S-->>C: Painel CORBAN: badge de expirado
    end

    Note over C, S: CORBAN confere o novo status na listagem,<br>sem precisar contatar a Operação.

    S->>O: Atualização automática da Operação
    deactivate S
    activate O
    Note over S, O: FIM US-01 // Proposta segue automaticamente para esteira de análise

    O->>O: INÍCIO US-02??
    deactivate O
```

### 1.1.2. US-02: Painel de Validação do Dossiê de Assinatura

Diagrama de relações entre Atores, Ações e Eventos e Painel de Validação do Dossiê de Assinatura:

```mermaid

sequenceDiagram
    actor O as Operador
    participant S as Sistema<br>(Painel de Validação - Dossiê de Assinatura)

    O-->>S: Acessa painel de Validação do Dossiê de Assinatura<br>(??A partir de lista/link de Assinaturas com Validação Pendentes??)

    Note over O, S: INÍCIO US-02<br/>Proposta de E-Assinatura pronta para validação

    activate S
    S-->>O: Exibe tela do dossiê com dados do assinante, selfie, documento e pontuação.
    activate O
    S-->>O: Exibe Dados da Proposta?? (Número da Proposta e Status??)
    deactivate S

    Note over O: Inicia a inspeção.
    O->>S: Inspeciona Dados do assinante:<br>• Nome Completo,<br>• CPF,<br>• Data de Assinatura,<br>• IP de origem.
    O->>S: Inspeciona Geolocacalização
    Note over O,S: Navega em mapa embutido.

    O->>S: Inspeciona Imagens de Selfie e Documento e Pontuação de Similaridade Facial.
    Note over O,S: Dá Zoom nas images de Selfie e Documento

    O->>O: Analisa se está dentro da política

    Note over O,S: Decide sobre a validação da assinatura digital
    deactivate O

    alt Operador aprova dossiê
        activate O
        O->>S: Clica em "Aprovado — dentro da política"
        activate S
        S-->>O: Feedback visual de sucesso (Sem Diálogo de confirmação???)
        deactivate S
        deactivate O
        activate S
        S->>S: Altera status para "Aguardando Auditoria"
        deactivate S
        Note over O, S: Proposta segue para esteira de auditoria
    else Operador reprova dossiê
        activate O
        O->>S: Clica em "Reprovado — fora da política"
        activate S
        S-->>O: Abre modal para informar motivo e pendência
        deactivate S
        O->>S: Preenche motivo motivo e pendência,  e confirma
        deactivate O
        activate S
        S->>S: Altera status para "Pendente"
        S-->>O: Feedback visual de pendência criada
        deactivate S
        Note over O, S: Proposta volta para correção
    end

    Note over O, S: FIM US-02<br/>Sem download/upload de ZIP, tudo dentro do sistema
        S-->>S: ?? Exibe botão de "Analizar Próxima Assinatura"??
        O-->>O: ?? Volta para lista de "Assinaturas com Validação Pendente"??

```
### 1.2. Diagramas de Modelagem de entidades e estados Client(para tipagem)

### 1.2.1. Diagrama de Modelagem de entidades

```mermaid

classDiagram
    class Cliente {
        <<abstract>>
        +nomeCompleto: string
        +cpf: string
    }

    class Proposta {
        +id: string
        +numero: string
        +status: StatusAssinatura
        +ultimoEvento: string
        +notificacao: boolean
    }

    class PropostaDetalhes {
        +linkAssinatura: string
        +dataEnvio: string
        +tentativasContato: TentativaContato[]
    }

    class DadosAssinante {
        +dataAssinatura: string
        +ip: string
        +coordenadas: Coordenadas
        +endereco: string
    }

    class Dossie {
        +idProposta: string
        +selfieUrl: string
        +documentoUrl: string
        +similaridadeFacial: number
        +statusValidacao: StatusDossie
    }

    class Coordenadas {
        +lat: number
        +lon: number
    }

    class TentativaContato {
        +data: string
        +meio: string
        +observacao: string
    }

    class StatusAssinatura {
        <<enumeration>>
        AGUARDANDO
        ASSINADO
        RECUSADO
        EXPIRADO
    }

    class StatusDossie {
        <<enumeration>>
        PENDENTE_VALIDACAO
        APROVADO_AGUARDANDO_AUDITORIA
        REPROVADO_PENDENTE
    }

    Cliente <|-- Proposta : estende
    Cliente <|-- DadosAssinante : estende
    Proposta <|-- PropostaDetalhes : estende
    Proposta "1" --> "*" TentativaContato : contém
    Dossie "1" --> "1" DadosAssinante : compõe
    Dossie "1" --> "1" Coordenadas : compõe (via DadosAssinante)
    Proposta --> StatusAssinatura : usa
    Dossie --> StatusDossie : usa

```

### 1.2.2. Diagrama para estados Client - Redux Store e Slices

```mermaid

classDiagram
    class RootState {
        +propostas: PropostasState
        +dossie: DossieState
    }

    class PropostasState {
        +Proposta[] lista
        +PropostaDetalhes? detalhe
        +StatusAssinatura? filtroStatus
        +string termoBusca
        +boolean loadingLista
        +boolean loadingDetalhe
        +string? erro
    }

    class DossieState {
        +Dossie? dossie
        +boolean loading
        +string? erro
        +StatusDossie? decisao
        +MotivoReprovacao? motivoReprovacao
        +boolean confirmandoAprovacao
        +boolean reprovando
    }

    RootState *-- PropostasState
    RootState *-- DossieState

```


## Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- MSW
- React Router
