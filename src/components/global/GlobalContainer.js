import { useContext, useState } from "react";
import { LoadingContext } from "../../providers/LoadingProvider";
import { WarningContext } from "../../providers/WarningProvider";
import GlobalLoading from "./global_Loading";
import GlobalWarning from "./global_Warning";

// Komponen untuk menampung popup global
export default function GlobalContainer() {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  return (
    <>
      {loading ? (
        <GlobalLoading
          error={loading.error}
          complete={loading.complete}
          customButtons={loading.customButtons}
        />
      ) : null}

      {warning ? (
        <GlobalWarning
          headerMessage={warning.headerMessage}
          message={warning.message}
          confirmAction={warning.confirmAction}
          singleConfirm={warning.singleConfirm}
        />
      ) : null}
    </>
  );
}
