import "../assets/css/components/header.css";

import { useContext } from "react";
import { LoginContext } from "../providers/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPerson, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { WarningContext } from "../providers/WarningProvider";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { login, setLogin } = useContext(LoginContext);
  const { warning, setWarning } = useContext(WarningContext);
  const navigate = useNavigate();

  return (
    <div className="app-header">
      <p>{login ? login.username : "Guest"}</p>
      <FontAwesomeIcon
        icon={faUserCircle}
        color="white"
        size="2x"
        className="clickable"
        onClick={() => {
          if (!login) return navigate("/auth");

          setWarning({
            headerMessage: "Konfirmasi Log Out",
            message: "Apakah anda yakin ingin log out?",
            confirmAction: () => {
              window.localStorage.removeItem("auth_token");
              setLogin(undefined);
              navigate("/auth");
            },
          });
        }}
      />
    </div>
  );
}
