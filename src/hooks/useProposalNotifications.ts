import { useEffect } from "react";

import { messages } from "../i18n/pt-BR";
import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/UiSlice";
import type { SigningProposal } from "../types/signingProposal";

// Módulo-level Set: persiste durante toda a vida da SPA
const notifiedIds = new Set<string>();

export function useProposalNotifications(itens: SigningProposal[]) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    itens.forEach((item) => {
      if (
        item.status === "SIGNED" &&
        item.notifiable &&
        !item.notified &&
        !notifiedIds.has(item.id)
      ) {
        notifiedIds.add(item.id);
        dispatch(
          addToast({
            message: messages.proposal.toast.newSignature
              .replace("{name}", item.customer.fullName)
              .replace("{id}", item.id),
            type: "info",
          }),
        );
      }
    });
  }, [itens, dispatch]);
}
