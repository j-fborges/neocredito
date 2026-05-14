import type { SigningProposal } from "../../types/signingProposal";

import StatusBadge from "./StatusBadge";

interface ProposalRowProps {
  proposal: SigningProposal;
  onClick: (proposal: SigningProposal) => void;
}

export default function ProposalRow({ proposal, onClick }: ProposalRowProps) {
  const { id, customer, status, lastSigningEvent, notifiable, notified } =
    proposal;

  // Exibe o indicador de novo apenas para propostas notificáveis, assinadas e não lidas
  const isNew = notifiable && status === "SIGNED" && !notified;

  return (
    <tr
      className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={() => onClick(proposal)}
    >
      <td className="p-1 sm:p-2">{id}</td>
      <td className="p-1 sm:p-2">
        {customer.fullName}
        {isNew && (
          <span className="ml-2 inline-flex items-center text-green-600 animate-pulse">
            ✔️
          </span>
        )}
      </td>
      <td className="p-1 sm:p-2">
        <StatusBadge status={status} pulse={isNew} />
      </td>
      <td className="p-1 sm:p-2">
        {new Date(lastSigningEvent).toLocaleDateString()}
      </td>
    </tr>
  );
}
