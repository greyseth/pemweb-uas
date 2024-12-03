import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingSpinner from "../LoadingSpinner";
import PopupContainer from "../PopupContainer";
import {
  faCheckCircle,
  faClose,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { LoadingContext } from "../../providers/LoadingProvider";

export default function GlobalLoading({ error, complete, customButtons }) {
  return (
    <PopupContainer zIndex={999}>
      <div className="popup-panel">
        {error ? (
          <Error />
        ) : complete ? (
          <Complete customButtons={customButtons} />
        ) : (
          <Loading />
        )}
      </div>
    </PopupContainer>
  );
}

function Loading() {
  return (
    <>
      <div className="header">
        <p>Mohon Tunggu</p>
      </div>
      <LoadingSpinner />
      <p className="message">Sedang memproses...</p>
    </>
  );
}

function Error() {
  const { loading, setLoading } = useContext(LoadingContext);

  return (
    <>
      <div className="header">
        <p>Proses Gagal</p>
        <FontAwesomeIcon
          icon={faClose}
          color="white"
          className="clickable"
          onClick={() => setLoading(undefined)}
        />
      </div>
      <FontAwesomeIcon
        icon={faExclamationCircle}
        color="white"
        size="6x"
        style={{
          display: "block",
          margin: "0 auto",
        }}
      />
      <p className="message">Sebuah kesalahan telah terjadi</p>
    </>
  );
}

function Complete({ customButtons }) {
  const { loading, setLoading } = useContext(LoadingContext);

  return (
    <>
      <div className="header">
        <p>Proses Berhasil</p>
        <FontAwesomeIcon
          icon={faClose}
          color="white"
          className="clickable"
          onClick={() => setLoading(undefined)}
        />
      </div>
      <FontAwesomeIcon
        icon={faCheckCircle}
        color="white"
        size="6x"
        style={{
          display: "block",
          margin: "0 auto",
        }}
      />
      <p className="message">Sukses</p>
      {customButtons && customButtons.length > 0
        ? customButtons.map((button, i) => {
            return (
              <button
                className="btn primary"
                onClick={() => {
                  button.action();
                  setLoading(undefined);
                }}
              >
                {button.label}
              </button>
            );
          })
        : null}
    </>
  );
}
