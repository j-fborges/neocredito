# Diagrama de Tipagem de Estados - Redux Store

Estrutura do estado global gerenciado pelo Redux Toolkit.

```mermaid
classDiagram
    class EstadoRaiz {
        +propostas: EstadoPropostas
        +dossie: EstadoDossie
    }

    class EstadoPropostas {
        +lista: PropostaAssinatura[]
        +detalhe: DetalhesProposal | null
        +filtroStatus: StatusAssinatura | null
        +termoBusca: string
        +carregandoLista: boolean
        +carregandoDetalhe: boolean
        +erro: string | null
    }

    class EstadoDossie {
        +dados: Dossie | null
        +carregando: boolean
        +erro: string | null
        +acaoEmProgresso: "aprovando" | "reprovando" | null
        +rascunhoReprovacao: string
    }

    EstadoRaiz *-- EstadoPropostas : contém
    EstadoRaiz *-- EstadoDossie : contém

```

## Descrição dos Estados

### EstadoRaiz
Raiz da store Redux contendo todos os slices principais

### EstadoPropostas
Estado gerenciando a lista de propostas de assinatura e seus detalhes
- **lista**: Array de propostas
- **detalhe**: Detalhes de uma proposta específica
- **filtroStatus**: Filtro por status atual
- **termoBusca**: Termo de busca aplicado
- **carregandoLista**: Indicador de carregamento da lista
- **carregandoDetalhe**: Indicador de carregamento de detalhes
- **erro**: Mensagem de erro se houver

### EstadoDossie
Estado gerenciando o dossiê de assinatura e processo de validação
- **dados**: Dados do dossiê carregado
- **carregando**: Indicador de carregamento
- **erro**: Mensagem de erro se houver
- **acaoEmProgresso**: Ação sendo executada (aprovação ou reprovação)
- **rascunhoReprovacao**: Motivo de reprovação em edição
