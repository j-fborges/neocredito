import { messages as translations } from "../../i18n/pt-BR";
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
      <h2 className="leading-6 text-xl md:pl-2 mb-4 p font-mono font-bold uppercase text-brand-blue-dark">
        {translations.dossier.signatoryData}
      </h2>
      <div className=" pl-2">
        <p>
          <strong className="font-mono uppercase font-2xs">
            {translations.dossier.name}:
          </strong>{" "}
          {signatory.fullName}
        </p>
        <p>
          <strong className="font-mono uppercase font-2xs">
            {translations.dossier.cpf}:
          </strong>{" "}
          {signatory.cpf}
        </p>
        <p>
          <strong className="font-mono uppercase font-2xs">
            {translations.dossier.signatureDate}:
          </strong>{" "}
          {formatDate(signatory.signatureDate)}
        </p>
        <p>
          <strong className="font-mono uppercase font-2xs">
            {translations.dossier.ip}:
          </strong>{" "}
          {signatory.ip}
        </p>
        <p>
          <strong className="font-mono uppercase font-2xs">
            {translations.dossier.address}:
          </strong>{" "}
          {signatory.address}
        </p>
      </div>
    </>
  );
}
