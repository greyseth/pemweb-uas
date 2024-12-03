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

// Halaman melihat data customer
export default function Page_Customers() {
  const { login, setLogin } = useContext(LoginContext);

  const [addCustomer, setAddCustomer] = useState(false);

  const [customersLoading, setCustomersLoading] = useState({
    loading: true,
    error: false,
  });
  const [customers, setCustomers] = useState([]);

  async function fetchCustomers() {
    setCustomersLoading({ loading: true, error: false });

    const response = await request("GET", "/order/customer");
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
        <h2>Daftar Customer ATK</h2>
        {login && login.role === "admin" ? (
          <button
            className="btn secondary"
            onClick={() => setAddCustomer(true)}
          >
            <FontAwesomeIcon
              icon={faAdd}
              color="white"
              style={{ marginRight: ".5em" }}
            />
            Tambah Customer
          </button>
        ) : null}
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
              <th>Nama Customer</th>
              <th>Alamat</th>
              <th>No Telepon</th>
              {/* <th></th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr>
                <td>{c.id_customer}</td>
                <td>{c.nama_customer}</td>
                <td>{c.alamat}</td>
                <td>{c.telepon}</td>
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

      const response = await request("POST", "/order/customer", input);
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
          <p>Tambah Customer</p>
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
            placeholder="Nama Customer"
            value={input.nama_customer}
            onChange={(e) =>
              setInput({ ...input, nama_customer: e.target.value })
            }
          />
          <textarea
            placeholder="Alamat"
            style={{ fontSize: ".85em", resize: "vertical" }}
            value={input.alamat}
            onChange={(e) => setInput({ ...input, alamat: e.target.value })}
          ></textarea>
          <input
            type="text"
            placeholder="Telepon"
            value={input.telepon}
            onChange={(e) => setInput({ ...input, telepon: e.target.value })}
          />
          <button className="btn primary" onClick={handleAdd}>
            Tambah Customer
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}
