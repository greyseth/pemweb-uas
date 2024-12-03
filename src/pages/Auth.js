import { useNavigate } from "react-router-dom";
import "../assets/css/Auth.css";
import { useContext, useState } from "react";
import { WarningContext } from "../providers/WarningProvider";
import { LoadingContext } from "../providers/LoadingProvider";
import { verifyInput } from "../util/verifyInput";
import { submitOnEnter } from "../util/formEnter";
import request from "../util/API";
import { LoginContext } from "../providers/LoginProvider";

// Halaman login
export default function Page_Auth() {
  const { login, setLogin } = useContext(LoginContext);
  const { warning, setWarning } = useContext(WarningContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  async function handleLogin() {
    const verified = verifyInput(input, () =>
      setWarning({
        headerMessage: "Tidak Bisa Login",
        message: "Username dan password harus terisi",
        singleConfirm: true,
      })
    );

    if (verified) {
      setLoading({});

      const response = await request("POST", "/user/login", input);
      if (response.error) return setLoading({ error: true });
      if (response.success) {
        window.localStorage.setItem("auth_token", response.data.auth_token);
        setLogin({
          username: response.data.username,
          role: response.data.role,
        });

        setLoading(undefined);
        navigate("/");
      } else {
        setLoading(undefined);
        setWarning({
          headerMessage: "Tidak Bisa Login",
          message: "Username/password tidak sesuai",
          singleConfirm: true,
        });
      }
    }
  }

  return (
    <section className="auth-container">
      <div className="popup-panel">
        <div className="header">
          <p>Login ke Akun Anda</p>
        </div>
        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={input.username}
            onKeyDown={(e) => submitOnEnter(e, handleLogin)}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            value={input.password}
            onKeyDown={(e) => submitOnEnter(e, handleLogin)}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />

          <button className="btn primary" onClick={handleLogin}>
            Login
          </button>
          <button className="btn red" onClick={() => navigate("/")}>
            Kembali ke Katalog
          </button>
        </div>
      </div>
    </section>
  );
}
