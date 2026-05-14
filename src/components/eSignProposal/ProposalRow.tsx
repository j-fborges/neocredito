import type { SigningProposal } from "../../types/signingProposal";

import StatusBadge from "./StatusBadge";

interface ProposalRowProps {
  proposal: SigningProposal;
  onClick: (proposal: SigningProposal) => void;
  index: number;
}

export default function ProposalRow({
  proposal,
  onClick,
  index,
}: ProposalRowProps) {
  const { id, customer, status, lastSigningEvent, notifiable, notified } =
    proposal;
  const isNew = notifiable && status === "SIGNED" && !notified;
  const isEven = index % 2 === 0;

  return (
    <tr
      className={`border-t cursor-pointer transition-colors ${
        isEven
          ? "bg-custom-lightgray hover:bg-blue-50"
          : "bg-gray-200 hover:bg-blue-50"
      }`}
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
        <StatusBadge status={status} pulse={isNew} centralized />
      </td>
      <td className="p-1 sm:p-2">
        {new Date(lastSigningEvent).toLocaleDateString()}
      </td>
    </tr>
  );
}
