import type { SigningProposal } from "../../types/signingProposal";

import ProposalRow from "./ProposalRow";

interface ProposalListProps {
  itens: SigningProposal[];
  onRowClick: (proposal: SigningProposal) => void;
}

export default function ProposalList({ itens, onRowClick }: ProposalListProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Cliente</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Último Evento</th>
        </tr>
      </thead>
      <tbody>
        {itens.map((proposal) => (
          <ProposalRow
            key={proposal.id}
            proposal={proposal}
            onClick={onRowClick}
          />
        ))}
      </tbody>
    </table>
  );
}
