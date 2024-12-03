import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../assets/css/Customer.css";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import request from "../util/API";
import LoadingSpinner from "../components/LoadingSpinner";
import PopupContainer from "../components/PopupContainer";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";
import { verifyInput } from "../util/verifyInput";
import { LoginContext } from "../providers/LoginProvider";

// Halaman untuk melihat data user aplikasi (salinan dari Customers.js)
export default function Page_Users() {
  const { login, setLogin } = useContext(LoginContext);

  const [addCustomer, setAddCustomer] = useState(false);

  const [customersLoading, setCustomersLoading] = useState({
    loading: true,
    error: false,
  });
  const [customers, setCustomers] = useState([]);

  async function fetchCustomers() {
    setCustomersLoading({ loading: true, error: false });

    const response = await request("GET", "/user/all");
    if (response.error)
      return setCustomersLoading({ loading: true, erro: true });

    setCustomers(response);

    setCustomersLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <section className="customers-container">
      {addCustomer ? (
        <AddCustomerPopup
          setAddCustomer={setAddCustomer}
          refreshList={fetchCustomers}
        />
      ) : null}

      <div className="customers-header">
        <h2>Daftar User ATK</h2>
        <button className="btn secondary" onClick={() => setAddCustomer(true)}>
          <FontAwesomeIcon
            icon={faAdd}
            color="white"
            style={{ marginRight: ".5em" }}
          />
          Tambah User
        </button>
      </div>

      {customersLoading.loading ? (
        customersLoading.error ? (
          <div className="loading-error">
            <h2>Sebuah Kesalahan Tejadi</h2>
            <button className="btn secondary" onClick={fetchCustomers}>
              Ulangi
            </button>
          </div>
        ) : (
          <LoadingSpinner />
        )
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Role</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr>
                <td>{c.id_user}</td>
                <td>{c.username}</td>
                <td>{c.password}</td>
                <td>{c.role}</td>
                {/* <td>
                  <button className="btn primary">Edit</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function AddCustomerPopup({ setAddCustomer, refreshList }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [input, setInput] = useState({});

  async function handleAdd() {
    const verified = verifyInput(input, () =>
      setWarning({
        headerMessage: "Tidak Bisa Menambahkan",
        message: "Semua field harus terisi",
        singleConfirm: true,
      })
    );

    if (verified) {
      setLoading({});

      const response = await request("POST", "/user/register", input);
      if (response && response.error) return setLoading({ error: true });

      setLoading({ complete: true });
      setAddCustomer(false);
      refreshList();
    }
  }

  return (
    <PopupContainer zIndex={998}>
      <div className="popup-panel">
        <div className="header">
          <p>Tambah User</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setAddCustomer(false)}
          />
        </div>
        <div className="form">
          <input
            type="text"
            placeholder="Username"
            value={input.username}
            onChange={(e) => setInput({ ...input, username: e.target.value })}
          />
          <input
            type="text"
            placeholder="Password"
            value={input.password}
            onChange={(e) => setInput({ ...input, password: e.target.value })}
          />

          <select
            value={input.role}
            onChange={(e) => setInput({ ...input, role: e.target.value })}
          >
            <option value={""}>-Pilih Role-</option>
            <option value={"admin"}>Admin</option>
            <option value={"kasir"}>Kasir</option>
            <option value={"supervisor"}>Supervisor</option>
          </select>

          <button className="btn primary" onClick={handleAdd}>
            Tambah User
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}
