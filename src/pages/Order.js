import "../assets/css/Order.css";

import {
  faAdd,
  faClose,
  faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import request from "../util/API";
import formatPrice from "../util/priceFormatter";
import formatDate from "../util/dateFormatter";
import PopupContainer from "../components/PopupContainer";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";
import { LoginContext } from "../providers/LoginProvider";

export default function Page_Order() {
  const { login, setLogin } = useContext(LoginContext);

  const [addOrder, setAddOrder] = useState(false);
  const [viewOrder, setViewOrder] = useState(undefined);

  const [orderLoading, setOrderLoading] = useState({
    penjualan: { loading: true, error: false },
    pembelian: { loading: true, error: false },
  });
  const [pembelian, setPembelian] = useState([]);
  const [penjualan, setPenjualan] = useState([]);

  async function fetchOrders() {
    setOrderLoading({
      penjualan: { loading: true, error: false },
      pembelian: { loading: true, error: false },
    });

    const pembelianResponse = await request("GET", "/order/pembelian");
    if (pembelianResponse.error)
      return setOrderLoading({
        ...orderLoading,
        pembelian: { ...orderLoading.pembelian, error: true },
      });

    const penjualanResponse = await request("GET", "/order/penjualan");
    if (penjualanResponse.error)
      return setOrderLoading({
        ...orderLoading,
        penjualan: { ...orderLoading.penjualan, error: true },
      });

    setPembelian(pembelianResponse);
    setPenjualan(penjualanResponse);

    setOrderLoading({ penjualan: {}, pembelian: {} });
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section className="order-container">
      {addOrder ? (
        <AddOrderPopup setAddOrder={setAddOrder} refreshList={fetchOrders} />
      ) : null}

      {viewOrder ? (
        <ViewOrderPopup viewOrder={viewOrder} setViewOrder={setViewOrder} />
      ) : null}

      <div className="order-header">
        <h2>Pemesanan Barang ATK</h2>
        {login && login.role === "kasir" ? (
          <button className="btn secondary" onClick={() => setAddOrder(true)}>
            <FontAwesomeIcon
              icon={faAdd}
              color="white"
              style={{ marginRight: ".5em" }}
            />
            Buat Pesanan
          </button>
        ) : null}
      </div>

      <div className="order-tables">
        <div>
          <h3 style={{ color: "var(--contrast-color)" }}>Data Pembelian</h3>
          {orderLoading.pembelian.loading ? (
            orderLoading.pembelian.error ? (
              <div className="loading-error">
                <h2>Sebuah Kesalahan Tejadi</h2>
                <button className="btn secondary" onClick={fetchOrders}>
                  Ulangi
                </button>
              </div>
            ) : (
              <LoadingSpinner />
            )
          ) : (
            <table className="styled-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Id Pembelian</th>
                  <th>Supplier</th>
                  <th>Tanggal Pesanan</th>
                  <th>Harga Total</th>
                </tr>
              </thead>
              <tbody>
                {pembelian.map((p) => (
                  <tr
                    key={p.id_pembelian}
                    className="clickable"
                    onClick={() =>
                      setViewOrder({
                        id_order: p.id_pembelian,
                        nama_transactor: p.nama_supplier,
                        tanggal: p.tanggal,
                        order_type: "pembelian",
                      })
                    }
                  >
                    <td>{p.id_pembelian}</td>
                    <td>{p.nama_supplier}</td>
                    <td>{formatDate(p.tanggal)}</td>
                    <td>{formatPrice(p.harga_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h3 style={{ color: "var(--contrast-color)" }}>Data Penjualan</h3>
          {orderLoading.penjualan.loading ? (
            orderLoading.penjualan.error ? (
              <div className="loading-error">
                <h2>Sebuah Kesalahan Tejadi</h2>
                <button className="btn secondary" onClick={fetchOrders}>
                  Ulangi
                </button>
              </div>
            ) : (
              <LoadingSpinner />
            )
          ) : (
            <table className="styled-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Id Penjualan</th>
                  <th>Customer</th>
                  <th>Tanggal Pesanan</th>
                  <th>Harga Total</th>
                </tr>
              </thead>
              <tbody>
                {penjualan.map((p) => (
                  <tr
                    key={p.id_penjualan}
                    className="clickable"
                    onClick={() =>
                      setViewOrder({
                        id_order: p.id_penjualan,
                        nama_transactor: p.nama_customer,
                        tanggal: p.tanggal,
                        order_type: "penjualan",
                      })
                    }
                  >
                    <td>{p.id_penjualan}</td>
                    <td>{p.nama_customer}</td>
                    <td>{formatDate(p.tanggal)}</td>
                    <td>{formatPrice(p.harga_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

function AddOrderPopup({ setAddOrder, refreshList }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [orderType, setOrderType] = useState("");
  const [idTransactor, setIdTransactor] = useState(undefined);
  const [barang, setBarang] = useState([]);

  const [transactors, setTransactors] = useState(undefined);
  const [items, setItems] = useState(undefined);

  async function fetchCustomers() {
    setTransactors(undefined);

    const response = await request("GET", "/order/customer");
    if (response.error) return alert("Gagal mengambil data customer");

    setTransactors(response);
  }

  async function fetchSuppliers() {
    setTransactors(undefined);

    const response = await request("GET", "/order/supplier");
    if (response.error) return alert("Gagal mengambil data supplier");

    setTransactors(response);
  }

  async function fetchItems() {
    const response = await request("GET", "/item");
    if (response.error) return alert("Gagal mengambil data barang");

    setItems(response);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (orderType) {
      if (orderType === "pembelian") fetchSuppliers();
      else fetchCustomers();
    }
  }, [orderType]);

  async function handleCreate() {
    let barangNull = false;
    barang.forEach((b) => {
      if (!b.id_barang || b.qty === undefined || b.qty === NaN)
        barangNull = true;
    });

    if (!idTransactor || barangNull)
      return setWarning({
        headerMessage: "Tidak Bisa Memproses",
        message: "Data tidak ada yang boleh kosong",
        singleConfirm: true,
      });

    setLoading({});

    const response = await request("POST", "/order", {
      id_transactor: idTransactor,
      order_type: orderType,
      barang: barang,
    });
    if (response.error) return setLoading({ error: true });

    setLoading({ complete: true });
    setAddOrder(false);
    refreshList();
  }

  return (
    <PopupContainer zIndex={998}>
      <div className="popup-panel">
        <div className="header">
          <p>Tambah Pesanan</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setAddOrder(false)}
          />
        </div>
        <div className="form">
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          >
            <option>-Pilih Jenis Pesanan-</option>
            <option value={"pembelian"}>Pembelian</option>
            <option value={"penjualan"}>Penjualan</option>
          </select>

          {orderType === "pembelian" ? (
            <select
              value={idTransactor}
              onChange={(e) => setIdTransactor(e.target.value)}
            >
              {transactors ? (
                <>
                  <option value={""}>-Pilih supplier-</option>
                  {transactors.map((t) => (
                    <option key={t[`id_supplier`]} value={t[`id_supplier`]}>
                      {t[`nama_supplier`]}
                    </option>
                  ))}
                </>
              ) : (
                <option value={""}>Loading supplier...</option>
              )}
            </select>
          ) : orderType === "penjualan" ? (
            <select
              value={idTransactor}
              onChange={(e) => setIdTransactor(e.target.value)}
            >
              {transactors ? (
                <>
                  <option value={""}>-Pilih customer-</option>
                  {transactors.map((t) => (
                    <option key={t[`id_customer`]} value={t[`id_customer`]}>
                      {t[`nama_customer`]}
                    </option>
                  ))}
                </>
              ) : (
                <option value={""}>Loading customer...</option>
              )}
            </select>
          ) : null}

          {orderType ? (
            <>
              <p
                style={{
                  marginTop: "1em",
                  marginBottom: ".5em",
                  paddingBottom: ".5em",
                  borderBottom: "2px solid white",
                  fontWeight: "bold",
                }}
              >
                Daftar Barang
              </p>
              <button
                className="btn primary"
                style={{ marginBottom: "1em" }}
                onClick={() =>
                  setBarang((prevBarang) => [
                    ...prevBarang,
                    { id_barang: undefined, qty: undefined },
                  ])
                }
              >
                Tambah
              </button>

              <ul className="barang-list">
                {barang.map((b, i) => (
                  <li key={i}>
                    <select
                      value={b.id_barang}
                      onChange={(e) =>
                        setBarang((prevBarang) => {
                          let barangCopy = prevBarang;
                          barangCopy[i].id_barang = e.target.value;
                          return barangCopy;
                        })
                      }
                    >
                      {items ? (
                        <>
                          <option value={""}>-Pilih Barang-</option>
                          {items.map((i) => (
                            <option value={i.id_barang} key={i.id_barang}>
                              {i.nama_barang}
                            </option>
                          ))}
                        </>
                      ) : (
                        <option value={""}>Loading barang...</option>
                      )}
                    </select>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={b.qty}
                      onChange={(e) =>
                        setBarang((prevBarang) => {
                          let barangCopy = prevBarang;
                          barangCopy[i].qty = e.target.value;
                          return barangCopy;
                        })
                      }
                    />
                    <FontAwesomeIcon
                      icon={faMinusCircle}
                      color="white"
                      className="clickable"
                      onClick={() =>
                        setBarang((prevBarang) =>
                          prevBarang.filter((pb, pbi) => pbi !== i)
                        )
                      }
                    />
                  </li>
                ))}
              </ul>

              <button className="btn primary" onClick={handleCreate}>
                Buat Pesanan
              </button>
            </>
          ) : null}
        </div>
      </div>
    </PopupContainer>
  );
}

function ViewOrderPopup({ viewOrder, setViewOrder }) {
  const [detailLoading, setDetailLoading] = useState({
    loading: true,
    error: false,
  });
  const [details, setDetails] = useState([]);

  async function fetchDetails() {
    setDetailLoading({ loading: true, error: false });

    const response = await request(
      "GET",
      `/order/${viewOrder.order_type}/${viewOrder.id_order}`
    );
    if (response.error) setDetailLoading({ loading: true, error: true });

    setDetails(response.barang);

    setDetailLoading({ loading: false, error: false });
  }

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <PopupContainer zIndex={998}>
      <div className="popup-panel order-panel">
        <div className="header">
          <p>Detail Pesanan</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setViewOrder(false)}
          />
        </div>
        <div className="order-content">
          <div>
            <p>{viewOrder.nama_transactor}</p>
            <p>{formatDate(viewOrder.tanggal)}</p>
          </div>
          <ul>
            {detailLoading.loading ? (
              detailLoading.error ? (
                <div className="loading-error">
                  <h2>Sebuah Kesalahan Tejadi</h2>
                  <button className="btn secondary" onClick={fetchDetails}>
                    Ulangi
                  </button>
                </div>
              ) : (
                <LoadingSpinner />
              )
            ) : (
              <>
                {details.map((d, i) => (
                  <li key={i}>
                    <p>
                      {d.nama_barang}{" "}
                      <span style={{ fontSize: ".85em", color: "gray" }}>
                        QTY: {d.qty}
                      </span>
                    </p>
                    <p>
                      Stok: {d.stok_barang} | Harga Satuan:{" "}
                      {formatPrice(d.harga_satuan)} | Harga Total:{" "}
                      {formatPrice(d.harga_total)}
                    </p>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </PopupContainer>
  );
}
