import { useEffect } from "react";

import {
  fetchDossier,
  clearDossier,
  selectDossier,
} from "../store/ESignDossierSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function useDossierLoader(id: string | undefined) {
  const dispatch = useAppDispatch();
  const {
    data: dossier,
    loading,
    error,
    actionInProgress,
  } = useAppSelector(selectDossier);

  useEffect(() => {
    if (id) {
      dispatch(fetchDossier(id));
    }
    return () => {
      dispatch(clearDossier());
    };
  }, [id, dispatch]);

  return { dossier, loading, error, actionInProgress };
}
