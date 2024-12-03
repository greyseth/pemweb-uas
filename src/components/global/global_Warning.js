import {
  faClose,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import PopupContainer from "../PopupContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { WarningContext } from "../../providers/WarningProvider";

export default function GlobalWarning({
  headerMessage,
  message,
  confirmAction,
  singleConfirm,
}) {
  const { warning, setWarning } = useContext(WarningContext);

  return (
    <PopupContainer zIndex={999}>
      <div className="popup-panel">
        <div className="header">
          <p>{headerMessage ?? "Konfirmasi Proses"}</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setWarning(undefined)}
          />
        </div>
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          color="white"
          size="6x"
          style={{
            display: "block",
            margin: "0 auto",
          }}
        />
        <p className="message">{message ?? "Apakah anda ingin melanjutkan?"}</p>

        {!singleConfirm ? (
          <>
            <button
              className="btn primary"
              style={{ marginBottom: "1em" }}
              onClick={() => {
                if (typeof confirmAction === "function") confirmAction();
                setWarning(undefined);
              }}
            >
              Ya
            </button>
            <button
              className="btn primary"
              onClick={() => setWarning(undefined)}
            >
              Tidak
            </button>
          </>
        ) : (
          <button
            className="btn primary"
            onClick={() => {
              if (typeof confirmAction === "function") confirmAction();
              setWarning(undefined);
            }}
          >
            Oke
          </button>
        )}
      </div>
    </PopupContainer>
  );
}
