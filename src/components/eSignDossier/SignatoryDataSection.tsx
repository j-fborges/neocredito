import { messages } from "../../i18n/pt-BR";
import type { SignatoryData } from "../../types/eSignDossier";

interface SignatoryDataSectionProps {
  signatory: SignatoryData;
  formatDate: (iso: string) => string;
}

export default function SignatoryDataSection({
  signatory,
  formatDate,
}: SignatoryDataSectionProps) {
  return (
    <>
      <h2 className="leading-6 text-xl mb-4 font-sans text-brand-blue-dark">
        {messages.dossier.signatoryData}
      </h2>
      <div className="space-y-2 pl-2">
        <p>
          <strong>{messages.dossier.name}:</strong> {signatory.fullName}
        </p>
        <p>
          <strong>{messages.dossier.cpf}:</strong> {signatory.cpf}
        </p>
        <p>
          <strong>{messages.dossier.signatureDate}:</strong>{" "}
          {formatDate(signatory.signatureDate)}
        </p>
        <p>
          <strong>{messages.dossier.ip}:</strong> {signatory.ip}
        </p>
        <p>
          <strong>{messages.dossier.address}:</strong> {signatory.address}
        </p>
      </div>
    </>
  );
}
