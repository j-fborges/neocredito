import type { ContactAttempt } from "../../types/signingProposal";

interface ContactAttemptProps {
  attempt: ContactAttempt;
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactAttempt({ attempt }: ContactAttemptProps) {
  return (
    <li className="bg-gray-50 rounded-lg p-3 space-y-1">
      <div className="text-sm text-gray-700">
        <span className="font-medium">Data:</span> {formatDate(attempt.date)}
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Meio:</span> {attempt.medium}
      </div>
      <div className="text-sm text-gray-700">
        <span className="font-medium">Observação:</span>{" "}
        {attempt.observation || "—"}
      </div>
    </li>
  );
}
