import { messages } from "../../i18n/pt-BR";
import type { SigningProposal } from "../../types/signingProposal";

import ProposalRow from "./ProposalRow";

interface ProposalListProps {
  itens: SigningProposal[];
  onRowClick: (proposal: SigningProposal) => void;
}

export default function ProposalList({ itens, onRowClick }: ProposalListProps) {
  const { table } = messages.proposal;

  return (
    <table className="sm:w-[100%] w-full border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-1 sm:p-2 text-left">{table.headerId}</th>
          <th className="p-1 sm:p-2 text-left">{table.headerCustomer}</th>
          <th className="p-1 sm:p-2 sm:pl-14 text-left">
            {table.headerStatus}
          </th>
          <th className="p-1 sm:p-2 text-left">{table.headerLastEvent}</th>
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
