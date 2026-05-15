import { messages } from "../../i18n/pt-BR";
import type { SignatoryData } from "../../types/eSignDossier";

interface SignatoryDataSectionProps {
  signatory: SignatoryData;
}

export default function SignatoryDataSection({
  signatory,
}: SignatoryDataSectionProps) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
