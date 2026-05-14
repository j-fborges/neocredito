import { useEffect } from "react";

import { useAppDispatch } from "../store/hooks";
import { fetchSigningProposals } from "../store/SigningProposalSlice";

export function useProposalPolling(interval = 15_000) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = setInterval(() => {
      dispatch(fetchSigningProposals());
    }, interval);
    return () => clearInterval(id);
  }, [dispatch, interval]);
}
