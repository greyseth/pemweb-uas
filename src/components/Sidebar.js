import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/css/components/sidebar.css";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { LoginContext } from "../providers/LoginProvider";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { login, setLogin } = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();

  const paths = [
    {
      route: "/",
      label: "Katalog",
      requireRoles: [],
    },
    {
      route: "/pemesanan",
      label: "Pemesanan",
      requireRoles: ["supervisor", "kasir"],
    },
    {
      route: "/customer",
      label: "Daftar Customer",
      requireRoles: ["supervisor", "admin"],
    },
    {
      route: "/supplier",
      label: "Daftar Supplier",
      requireRoles: ["supervisor", "admin"],
    },
    {
      route: "/users",
      label: "Kelola User",
      requireRoles: ["admin"],
    },
  ];

  return (
    <aside>
      <h2>Katalog ATK</h2>
      <ul>
        {paths
          .filter(
            login
              ? (p) =>
                  p.requireRoles.includes(login.role) ||
                  p.requireRoles.length < 1
              : (p) => p.requireRoles.length < 1
          )
          .map((p, i) => (
            <li className="clickable" onClick={() => navigate(p.route)} key={i}>
              <p>{p.label}</p>
              {location.pathname === p.route ? (
                <FontAwesomeIcon icon={faArrowRight} color="white" size="1x" />
              ) : null}
            </li>
          ))}
      </ul>
    </aside>
  );
}
