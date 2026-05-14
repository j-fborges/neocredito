export const ESIGN_STATUS = {
  AWAITING: "AWAITING",
  SIGNED: "SIGNED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;

// Justificativa do uso do padrão "as const" em DEV_CHOICES.md no item 2.7.

export const CONTACT_ATTEMPT_MEDIUM = {
  EMAIL: "EMAIL",
  TELEPHONE: "TELEPHONE",
  WHATSAPP: "WHATSAPP",
  SMS: "SMS",
} as const;

export type ESignStatus = keyof typeof ESIGN_STATUS;

export type ContactAttemptMedium = keyof typeof CONTACT_ATTEMPT_MEDIUM;

export interface Customer {
  fullName: string;
  cpf: string;
}

export interface SigningProposal {
  id: string;
  status: ESignStatus;
  lastSigningEvent: string;
  notified: boolean;
  notifiable: boolean;
  customer: Customer;
  details: ProposalDetails;
}

export interface ContactAttempt {
  date: string;
  medium: ContactAttemptMedium;
  observation: string;
}

export interface ProposalDetails {
  eSignLink: string;
  sentDate: string;
  contactAttempts: ContactAttempt[];
}
