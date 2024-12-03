const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authenticateToken = require("./middlewares/authenticateToken");
const verifyRole = require("./middlewares/verifyRole");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());

// Function before any authentication process
app.get("/", (req, res) => {
  connection.query(
    `
      SELECT barang.*, barang_kategori.nama_kategori FROM barang
      LEFT JOIN barang_kategori ON barang_kategori.id_barang_kategori = barang.id_barang_kategori;
    `,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(rows);
    }
  );
});

app.use(authenticateToken);
app.use(verifyRole);

app.get("/", (req, res) => res.sendStatus(200));

const userRouter = require("./routes/user");
const itemRouter = require("./routes/item");
const orderRouter = require("./routes/order");
const connection = require("./util/db");
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/order", orderRouter);

app.listen(3000, () => console.log("Pemweb API is running"));
