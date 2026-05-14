export const DOSSIER_STATUS = {
  PENDING_VALIDATION: "PENDING_VALIDATION",
  APPROVED_AWAITING_AUDIT: "APPROVED_AWAITING_AUDIT",
  DISAPPROVED_PENDING: "DISAPPROVED_PENDING",
} as const;

export type DossierStatus = keyof typeof DOSSIER_STATUS;

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface SignatoryData {
  fullName: string;
  cpf: string;
  signatureDate: string;
  ip: string;
  coordinates: Coordinates;
  address: string;
}

export interface Dossier {
  proposalId: string;
  signatory: SignatoryData;
  selfieUrl: string;
  documentUrl: string;
  facialSimilarity: number;
  status: DossierStatus;
}

export interface DossierState {
  data: Dossier | null;
  loading: boolean;
  error: string | null;
  actionInProgress: "approving" | "disapproving" | null;
}
