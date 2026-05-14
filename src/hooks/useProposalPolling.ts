import { useEffect } from "react";

import { useAppDispatch } from "../store/hooks";
import { fetchSigningProposalsSilently } from "../store/SigningProposalSlice";

export function useProposalPolling(interval = 15_000) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = setInterval(() => {
      dispatch(fetchSigningProposalsSilently());
    }, interval);
    return () => clearInterval(id);
  }, [dispatch, interval]);
}
