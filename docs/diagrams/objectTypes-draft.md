# Diagrama para Tipagem de Objetos - Conceitual

Não é necessariamente o que está implementado.* Aqui o pensamento é o de modelagens de entidades para além de instancias do frontend.

```mermaid
classDiagram
    class Cliente {
        +id: string
        +nomeCompleto: string
        +cpf: string
    }

    class PropostaAssinatura {
        +id: string
        +status: StatusAssinatura
        +ultimoEventoAssinatura: string
        +notificado: boolean
        +notificavel: boolean
        +cliente: Cliente
        +detalhes: DetalhesProposal
    }

    class DetalhesProposal {
        +linkAssinatura: string
        +dataSentimento: string
        +tentativasContato: TentativaContato[]
    }

    class TentativaContato {
        +id: string
        +data: string
        +meio: MeioContato
        +observacao: string
    }

    class MeioContato {
        <<enum>>
        EMAIL
        TELEFONE
        WHATSAPP
        SMS
    }

    class Dossie {
        +id: string
        +idProposta: string
        +assinante: DadosAssinante
        +urlSelfie: string
        +urlDocumento: string
        +similaridadeFacial: number
        +status: StatusDossie
    }

    class DadosAssinante {
        +nomeCompleto: string
        +cpf: string
        +dataAssinatura: string
        +ip: string
        +coordenadas: Coordenadas
        +endereco: string
        +bairro: string
        +cep: string
        +cidade: string
        +pais: string
    }

    class Coordenadas {
        +latitude: number
        +longitude: number
    }

    class StatusAssinatura {
        <<enum>>
        AGUARDANDO
        ASSINADO
        RECUSADO
        EXPIRADO
    }

    class StatusDossie {
        <<enum>>
        VALIDACAO_PENDENTE
        APROVADO_AGUARDANDO_AUDITORIA
        REPROVADO_PENDENTE
    }

    PropostaAssinatura --> Cliente : contém
    PropostaAssinatura --> DetalhesProposal : contém
    PropostaAssinatura --> StatusAssinatura : utiliza
    DetalhesProposal "1" --> "*" TentativaContato : contém
    TentativaContato --> MeioContato : utiliza
    Dossie --> DadosAssinante : contém
    Dossie --> Coordenadas : contém (via DadosAssinante)
    Dossie --> StatusDossie : utiliza

```

## Descrição dos Tipos

### Cliente
Dados básicos do cliente

### PropostaAssinatura
Proposta de assinatura eletrônica com status de processamento

### DetalhesProposal
Informações adicionais sobre a proposta de assinatura

### TentativaContato
Registro de tentativas de contato com o cliente

### DadosAssinante
Dados detalhados de quem assinou, incluindo localização

### Dossie
Dossiê completo de assinatura com validação
