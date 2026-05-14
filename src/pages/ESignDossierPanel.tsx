import { useEffect } from "react";
import { useParams } from "react-router-dom";

import DossierStatusBadge from "../components/eSignDossier/DossierStatusBadge";
import { messages } from "../i18n/pt-BR";
import {
  fetchDossier,
  selectDossier,
  clearDossier,
} from "../store/ESignDossierSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function ESignDossierPanel() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: dossier, loading, error } = useAppSelector(selectDossier);

  useEffect(() => {
    if (id) {
      dispatch(fetchDossier(id));
    }
    return () => {
      dispatch(clearDossier());
    };
  }, [id, dispatch]);

  if (loading) return <div className="p-6">Carregando...</div>;
  if (error) return <div className="p-6 text-red-500">Erro: {error}</div>;
  if (!dossier) return <div className="p-6">Nenhum dossiê encontrado.</div>;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="flex-1 max-w-6xl lg:max-w-[60%] xl:max-w-[70%] mx-auto sm:mx-5 p-2">
      <h1 className="leading-6 text-2xl pt-0 sm:pt-2 pl-1 font-bold mb-4 font-mono uppercase text-brand-blue-dark">
        {messages.dossier.title}
      </h1>

      {/* Cabeçalho da proposta */}
      <div className="flex flex-col mb-4 sm:pt-2 gap border-l-4 border-brand-blue-dark pl-2 ml-1">
        <span className="text-lg font-bold font-mono uppercase">
          {messages.dossier.proposalNumber}: {dossier.proposalId}
        </span>
        <span className="text-lg text-brand-blue-dark flex items-center gap-2">
          <span className="uppercase font-mono font-bold text-lg">
            {messages.dossier.status}:
          </span>
          <DossierStatusBadge status={dossier.status} />
        </span>
      </div>

      {/* Separador azul sutil */}
      <hr className="border-brand-blue-dark/20 my-4" />

      {/* Dados do assinante */}
      <h2 className="leading-6 text-xl mb-4 font-sans text-brand-blue-dark">
        {messages.dossier.signatoryData}
      </h2>
      <div className="space-y-2 pl-2">
        <p>
          <strong>{messages.dossier.name}:</strong> {dossier.signatory.fullName}
        </p>
        <p>
          <strong>{messages.dossier.cpf}:</strong> {dossier.signatory.cpf}
        </p>
        <p>
          <strong>{messages.dossier.signatureDate}:</strong>{" "}
          {formatDate(dossier.signatory.signatureDate)}
        </p>
        <p>
          <strong>{messages.dossier.ip}:</strong> {dossier.signatory.ip}
        </p>
        <p>
          <strong>{messages.dossier.address}:</strong>{" "}
          {dossier.signatory.address}
        </p>
      </div>

      <hr className="border-brand-blue-dark/20 my-4" />

      {/* Placeholder para seções futuras */}
      <p>
        <strong>{messages.dossier.facialSimilarity}:</strong>{" "}
        {dossier.facialSimilarity}%
      </p>
    </main>
  );
}
