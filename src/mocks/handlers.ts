import { http, HttpResponse } from "msw";

import {
  CONTACT_ATTEMPT_MEDIUM,
  ESIGN_STATUS,
  type ApiResponse,
  type ESignStatus,
  type SigningProposal,
} from "../types/signingProposal";

const daysAgo = (days: number, hour = 0, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const proposals: SigningProposal[] = [
  {
    id: "101",
    customer: { fullName: "João Silva", cpf: "123.456.789-00" },
    status: ESIGN_STATUS.SIGNED,
    lastSigningEvent: daysAgo(5, 10, 30),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/abc101",
      sentDate: daysAgo(10, 9, 0),
      contactAttempts: [
        {
          date: daysAgo(8, 14, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Lembrete de assinatura enviado",
        },
        {
          date: daysAgo(6, 11, 15),
          medium: CONTACT_ATTEMPT_MEDIUM.WHATSAPP,
          observation: "Contato via WHATSAPP",
        },
      ],
    },
  },
  {
    id: "202",
    customer: { fullName: "Maria Souza", cpf: "987.654.321-00" },
    status: ESIGN_STATUS.AWAITING,
    lastSigningEvent: daysAgo(2),
    notified: false,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/def202",
      sentDate: daysAgo(2),
      contactAttempts: [],
    },
  },
  {
    id: "303",
    customer: { fullName: "Carlos Pereira", cpf: "111.222.333-44" },
    status: ESIGN_STATUS.REJECTED,
    lastSigningEvent: daysAgo(12, 16, 45),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/ghi303",
      sentDate: daysAgo(20, 8, 0),
      contactAttempts: [
        {
          date: daysAgo(18, 10, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.TELEPHONE,
          observation: "Cliente recusou a proposta",
        },
        {
          date: daysAgo(14, 9, 30),
          medium: CONTACT_ATTEMPT_MEDIUM.SMS,
          observation: "Envio de SMS informativo",
        },
      ],
    },
  },
  {
    id: "404",
    customer: { fullName: "Ana Oliveira", cpf: "222.333.444-55" },
    status: ESIGN_STATUS.SIGNED,
    lastSigningEvent: daysAgo(3, 8, 0),
    notified: false,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/jkl404",
      sentDate: daysAgo(4, 11, 0),
      contactAttempts: [
        {
          date: daysAgo(4, 14, 20),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Confirmação de assinatura",
        },
      ],
    },
  },
  {
    id: "505",
    customer: { fullName: "Roberto Lima", cpf: "333.444.555-66" },
    status: ESIGN_STATUS.EXPIRED,
    lastSigningEvent: daysAgo(45, 0, 0),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/mno505",
      sentDate: daysAgo(50, 10, 0),
      contactAttempts: [
        {
          date: daysAgo(48, 9, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Aviso de expiração",
        },
        {
          date: daysAgo(46, 14, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.TELEPHONE,
          observation: "Tentativa de contato telefônico",
        },
      ],
    },
  },
  {
    id: "606",
    customer: { fullName: "Juliana Costa", cpf: "444.555.666-77" },
    status: ESIGN_STATUS.AWAITING,
    lastSigningEvent: daysAgo(1, 12, 0),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/pqr606",
      sentDate: daysAgo(1, 10, 0),
      contactAttempts: [
        {
          date: daysAgo(1, 10, 5),
          medium: CONTACT_ATTEMPT_MEDIUM.WHATSAPP,
          observation: "Lembrete automático",
        },
      ],
    },
  },
  {
    id: "707",
    customer: { fullName: "Fernando Alves", cpf: "555.666.777-88" },
    status: ESIGN_STATUS.SIGNED,
    lastSigningEvent: daysAgo(15, 18, 0),
    notified: false,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/stu707",
      sentDate: daysAgo(18, 7, 0),
      contactAttempts: [
        {
          date: daysAgo(17, 10, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Proposta assinada digitalmente",
        },
        {
          date: daysAgo(16, 14, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.SMS,
          observation: "Confirmação de recebimento",
        },
      ],
    },
  },
  {
    id: "808",
    customer: { fullName: "Patrícia Santos", cpf: "666.777.888-99" },
    status: ESIGN_STATUS.REJECTED,
    lastSigningEvent: daysAgo(30, 9, 0),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/vwx808",
      sentDate: daysAgo(35, 8, 0),
      contactAttempts: [
        {
          date: daysAgo(33, 15, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.TELEPHONE,
          observation: "Cliente não aceitou termos",
        },
        {
          date: daysAgo(31, 11, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Envio de nova proposta",
        },
      ],
    },
  },
  {
    id: "909",
    customer: { fullName: "Lucas Mendes", cpf: "777.888.999-00" },
    status: ESIGN_STATUS.AWAITING,
    lastSigningEvent: daysAgo(7, 14, 0),
    notified: false,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/yza909",
      sentDate: daysAgo(7, 9, 0),
      contactAttempts: [],
    },
  },
  {
    id: "1010",
    customer: { fullName: "Beatriz Rocha", cpf: "888.999.000-11" },
    status: ESIGN_STATUS.EXPIRED,
    lastSigningEvent: daysAgo(55, 10, 0),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/bcd1010",
      sentDate: daysAgo(60, 8, 30),
      contactAttempts: [
        {
          date: daysAgo(58, 12, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.WHATSAPP,
          observation: "Aviso de prazo final",
        },
        {
          date: daysAgo(56, 16, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Última tentativa de contato",
        },
      ],
    },
  },
  {
    id: "1112",
    customer: { fullName: "Gustavo Nogueira", cpf: "999.000.111-22" },
    status: ESIGN_STATUS.SIGNED,
    lastSigningEvent: daysAgo(25, 17, 30),
    notified: false,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/efg1112",
      sentDate: daysAgo(28, 9, 0),
      contactAttempts: [
        {
          date: daysAgo(27, 10, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Assinatura concluída com sucesso",
        },
      ],
    },
  },
  {
    id: "1213",
    customer: { fullName: "Camila Ferreira", cpf: "000.111.222-33" },
    status: ESIGN_STATUS.REJECTED,
    lastSigningEvent: daysAgo(8, 11, 45),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/hij1213",
      sentDate: daysAgo(10, 8, 0),
      contactAttempts: [
        {
          date: daysAgo(9, 13, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.SMS,
          observation: "Cliente solicitou cancelamento",
        },
        {
          date: daysAgo(8, 15, 20),
          medium: CONTACT_ATTEMPT_MEDIUM.TELEPHONE,
          observation: "Confirmação de cancelamento",
        },
      ],
    },
  },
  {
    id: "1314",
    customer: { fullName: "Rafael Barbosa", cpf: "111.222.333-44" },
    status: ESIGN_STATUS.AWAITING,
    lastSigningEvent: daysAgo(3, 16, 0),
    notified: true,
    details: {
      eSignLink: "https://assinatura.neo.com/assinar/klm1314",
      sentDate: daysAgo(3, 10, 0),
      contactAttempts: [
        {
          date: daysAgo(3, 10, 30),
          medium: CONTACT_ATTEMPT_MEDIUM.WHATSAPP,
          observation: "Lembrete de pendência",
        },
        {
          date: daysAgo(2, 9, 0),
          medium: CONTACT_ATTEMPT_MEDIUM.EMAIL,
          observation: "Reenvio do link de assinatura",
        },
      ],
    },
  },
];

export const handlers = [
  // GET /api/proposals
  http.get("/api/proposals", ({ request }) => {
    const url = new URL(request.url);
    const statusFilter = url.searchParams.get("status") as ESignStatus | null;
    const searchTerm = url.searchParams.get("q")?.toLowerCase();

    let result = [...proposals];

    if (statusFilter) {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.customer.fullName.toLowerCase().includes(searchTerm) ||
          p.id.toLowerCase().includes(searchTerm),
      );
    }

    const response: ApiResponse<SigningProposal[]> = { data: result };
    return HttpResponse.json(response);
  }),

  // GET /api/proposals/:id
  http.get("/api/proposals/:id", ({ params }) => {
    const { id } = params;
    const proposal = proposals.find((p) => p.id === id);
    if (!proposal) {
      return new HttpResponse(null, { status: 404 });
    }
    const response: ApiResponse<SigningProposal> = { data: proposal };
    return HttpResponse.json(response);
  }),
];
