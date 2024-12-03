import { useContext, useEffect } from "react";
import { LoginContext } from "../../providers/LoginProvider";
import { LoadingContext } from "../../providers/LoadingProvider";
import request from "../../util/API";
import { useNavigate } from "react-router-dom";

// Mengecek storage untuk data login dan memverifikasi
export default function LoginChecker() {
  const { login, setLogin } = useContext(LoginContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkLogin() {
      if (!login) {
        if (window.localStorage.getItem("auth_token")) {
          setLoading({});

          const response = await request("GET", "/user/self");
          if (response.error) {
            alert("Gagal memverifikasi login");
            navigate("/auth");
            return;
          }

          setLogin({
            username: response.username,
            role: response.role,
          });

          setLoading(undefined);
        }
      }
    }

    checkLogin();
  }, []);
}
