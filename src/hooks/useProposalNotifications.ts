import { useEffect, useRef } from "react";

import { useAppDispatch } from "../store/hooks";
import { addToast } from "../store/UiSlice";
import type { SigningProposal } from "../types/signingProposal";

export function useProposalNotifications(itens: SigningProposal[]) {
  const dispatch = useAppDispatch();
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Remove IDs que não estão mais na lista
    const currentIds = new Set(itens.map((i) => i.id));
    for (const id of notifiedIds.current) {
      if (!currentIds.has(id)) {
        notifiedIds.current.delete(id);
      }
    }

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
            message: `Nova assinatura: ${item.customer.fullName} (${item.id})`,
            type: "info",
          }),
        );
      }
    });
  }, [itens, dispatch]);
}
