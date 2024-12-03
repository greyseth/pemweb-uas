import { useContext, useEffect, useState } from "react";
import "../assets/css/Catalog.css";
import LoadingSpinner from "../components/LoadingSpinner";
import { LoginContext } from "../providers/LoginProvider";
import request from "../util/API";
import formatPrice from "../util/priceFormatter";
import PopupContainer from "../components/PopupContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { LoadingContext } from "../providers/LoadingProvider";
import { WarningContext } from "../providers/WarningProvider";
import { verifyInput } from "../util/verifyInput";

export default function Page_Catalog() {
  const { login, setLogin } = useContext(LoginContext);

  const [itemsLoading, setItemsLoading] = useState({
    loading: true,
    error: false,
  });
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(undefined);
  const [addItem, setAddItem] = useState(undefined);

  async function fetchItems() {
    setItemsLoading({ loading: true, error: false });

    const response = await request("GET", "/item");
    if (response.error) return setItemsLoading({ loading: true, error: true });

    setItems(response);

    setItemsLoading({ loading: false });
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <section className="catalog-container">
      {editItem ? (
        <EditItemPopup
          editItem={editItem}
          setEditItem={setEditItem}
          refreshList={fetchItems}
        />
      ) : null}

      {addItem ? (
        <AddItemPopup setAddItem={setAddItem} refreshList={fetchItems} />
      ) : null}

      <div className="catalog-header">
        <h2>Katalog Barang ATK</h2>
        {login & (login.role === "admin") ? (
          <button className="btn secondary" onClick={() => setAddItem(true)}>
            <FontAwesomeIcon
              icon={faAdd}
              color="white"
              style={{ marginRight: ".5em" }}
            />
            Tambah Barang
          </button>
        ) : null}
      </div>

      {itemsLoading.loading ? (
        itemsLoading.error ? (
          <div className="loading-error">
            <h2>Sebuah Kesalahan Tejadi</h2>
            <button className="btn secondary" onClick={fetchItems}>
              Ulangi
            </button>
          </div>
        ) : (
          <LoadingSpinner />
        )
      ) : (
        <ul className="catalog-list">
          {items.map((i) => (
            <li key={i.id_barang}>
              <div>
                <h2>
                  {i.id_barang} - {i.nama_barang}
                </h2>
                <p>{formatPrice(i.harga_jual)}</p>
              </div>
              <div>
                <p>{i.nama_kategori}</p>
                {login && login.role === "admin" ? (
                  <button
                    className="btn tertiary"
                    onClick={() => setEditItem(i)}
                  >
                    Edit
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EditItemPopup({ editItem, setEditItem, refreshList }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [data, setData] = useState(editItem);
  const [cats, setCats] = useState(undefined);

  async function fetchCategories() {
    const response = await request("GET", "/item/categories");
    if (response.error) return alert("Gagal mengambil kategori barang");

    setCats(response);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleUpdate() {
    const verified = verifyInput(data, () =>
      setWarning({
        headerMessage: "Tidak bisa menambahkan",
        message: "Semua data harus terisi",
        singleConfirm: true,
      })
    );
    if (verified) {
      setLoading({});

      const response = await request("PUT", `/item/${data.id_barang}`, data);
      if (response && response.error) return setLoading({ error: true });

      setLoading({ complete: true });
      setEditItem(undefined);
      refreshList();
    }
  }

  return (
    <PopupContainer zIndex={998}>
      <div className="popup-panel">
        <div className="header">
          <p>Edit Barang</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setEditItem(undefined)}
          />
        </div>
        <div className="form">
          <input
            type="text"
            placeholder="Nama Barang"
            value={data.nama_barang}
            onChange={(e) => setData({ ...data, nama_barang: e.target.value })}
          />
          <select
            style={{ color: "black" }}
            value={data.id_barang_kategori}
            onChange={(e) =>
              setData({ ...data, id_barang_kategori: e.target.value })
            }
          >
            {cats ? (
              cats.map((c) => (
                <option
                  key={c.id_barang_kategori}
                  value={c.id_barang_kategori}
                  style={{ color: "black" }}
                >
                  {c.nama_kategori}
                </option>
              ))
            ) : (
              <option value={""} style={{ color: "black" }}>
                Loading Kategori...
              </option>
            )}
          </select>
          <input
            type="number"
            placeholder="Harga Beli (Rp.)"
            value={data.harga}
            onChange={(e) => setData({ ...data, harga: e.target.value })}
          />
          <input
            type="number"
            placeholder="Harga Jual (Rp.)"
            value={data.harga_jual}
            onChange={(e) => setData({ ...data, harga_jual: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stok"
            value={data.stok}
            onChange={(e) => setData({ ...data, stok: e.target.value })}
          />
          <button className="btn primary" onClick={handleUpdate}>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}

function AddItemPopup({ setAddItem, refreshList }) {
  const { loading, setLoading } = useContext(LoadingContext);
  const { warning, setWarning } = useContext(WarningContext);

  const [data, setData] = useState({});
  const [cats, setCats] = useState(undefined);

  async function fetchCategories() {
    const response = await request("GET", "/item/categories");
    if (response.error) return alert("Gagal mengambil kategori barang");

    setCats(response);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd() {
    const verified = verifyInput(data, () =>
      setWarning({
        headerMessage: "Tidak bisa menambahkan",
        message: "Semua data harus terisi",
        singleConfirm: true,
      })
    );
    if (verified) {
      setLoading({});

      const response = await request("POST", `/item`, data);
      if (response && response.error) return setLoading({ error: true });

      setLoading({ complete: true });
      setAddItem(undefined);
      refreshList();
    }
  }

  return (
    <PopupContainer zIndex={998}>
      <div className="popup-panel">
        <div className="header">
          <p>Tambah Barang</p>
          <FontAwesomeIcon
            icon={faClose}
            color="white"
            className="clickable"
            onClick={() => setAddItem(undefined)}
          />
        </div>
        <div className="form">
          <input
            type="text"
            placeholder="Nama Barang"
            value={data.nama_barang}
            onChange={(e) => setData({ ...data, nama_barang: e.target.value })}
          />
          <select
            style={{ color: "black" }}
            value={data.id_barang_kategori}
            onChange={(e) =>
              setData({ ...data, id_barang_kategori: e.target.value })
            }
          >
            {cats ? (
              <>
                <option>-Pilih Kategori-</option>
                {cats.map((c) => (
                  <option
                    key={c.id_barang_kategori}
                    value={c.id_barang_kategori}
                    style={{ color: "black" }}
                  >
                    {c.nama_kategori}
                  </option>
                ))}
              </>
            ) : (
              <option value={""} style={{ color: "black" }}>
                Loading Kategori...
              </option>
            )}
          </select>
          <input
            type="number"
            placeholder="Harga Beli (Rp.)"
            value={data.harga}
            onChange={(e) => setData({ ...data, harga: e.target.value })}
          />
          <input
            type="number"
            placeholder="Harga Jual (Rp.)"
            value={data.harga_jual}
            onChange={(e) => setData({ ...data, harga_jual: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stok"
            value={data.stok}
            onChange={(e) => setData({ ...data, stok: e.target.value })}
          />
          <button className="btn primary" onClick={handleAdd}>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </PopupContainer>
  );
}
