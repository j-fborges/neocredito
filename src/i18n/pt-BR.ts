export const messages = {
  proposal: {
    title: "Painel de Acompanhamento do CORBAN",
    subtitle: "Assinaturas Eletrônicas de Propostas em Operação:",
    filter: {
      allStatuses: "Todos os status",
      searchPlaceholder: "Buscar por nome ou ID...",
      statusLabel: "Filtrar por status",
    },
    table: {
      headerId: "ID",
      headerCustomer: "Cliente",
      headerStatus: "Status",
      headerLastEvent: "Último Evento",
    },
    loading: "Carregando propostas...",
    empty: {
      title: "Nenhuma proposta encontrada",
      description: "Tente ajustar os filtros ou o termo de busca.",
    },
    modal: {
      title: "Detalhes da Proposta",
      close: "Fechar modal",
      client: "Cliente",
      cpf: "CPF",
      status: "Status",
      link: "Link de Assinatura",
      sentDate: "Data de Envio",
      attempts: "Tentativas de Contato",
      noAttempts: "Nenhuma tentativa registrada.",
      fields: {
        date: "Data",
        medium: "Meio",
        observation: "Observação",
      },
    },
  },
  status: {
    AWAITING: "Aguardando",
    SIGNED: "Assinado",
    REJECTED: "Recusado",
    EXPIRED: "Expirado",
  },
  contactMedium: {
    EMAIL: "E-mail",
    TELEPHONE: "Telefone",
    WHATSAPP: "WhatsApp",
    SMS: "SMS",
  },
  error: {
    loading: "Erro ao carregar propostas.",
    general: "Ocorreu um erro inesperado.",
  },
} as const;
