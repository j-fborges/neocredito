import type { SigningProposal } from "../../types/signingProposal";

import StatusBadge from "./StatusBadge";

interface ProposalRowProps {
  proposal: SigningProposal;
  onClick: (proposal: SigningProposal) => void;
}

export default function ProposalRow({ proposal, onClick }: ProposalRowProps) {
  return (
    <tr
      className="border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(proposal)}
    >
      <td className="p-2">{proposal.id}</td>
      <td className="p-2">
        {proposal.customer.fullName}
        {proposal.notified && (
          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        )}
      </td>
      <td className="p-2">
        <StatusBadge status={proposal.status} />
      </td>
      <td className="p-2">
        {new Date(proposal.lastSigningEvent).toLocaleDateString()}
      </td>
    </tr>
  );
}
