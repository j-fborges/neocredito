import { useEffect, useRef } from "react";

import { messages } from "../i18n/pt-BR";
import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/UiSlice";
import type { SigningProposal } from "../types/signingProposal";

export function useProposalNotifications(itens: SigningProposal[]) {
  const dispatch = useAppDispatch();
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    itens.forEach((item) => {
      if (
        item.status === "SIGNED" &&
        item.notifiable &&
        !item.notified &&
        !notifiedIds.current.has(item.id)
      ) {
        notifiedIds.current.add(item.id);
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
