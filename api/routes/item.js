const express = require("express");
const fs = require("fs");
const requireParams = require("../middlewares/requireParams");
const requireRoles = require("../middlewares/requireRoles");
const connection = require("../util/db");
const requireParamsAfter = require("../middlewares/requireParamsAfter");
const router = express.Router();

router.post(
  "/",
  requireParams([
    "nama_barang",
    "id_barang_kategori",
    "harga",
    "stok",
    "harga_jual",
  ]),
  requireRoles(["admin"]),
  (req, res) => {
    connection.query(
      `
      INSERT INTO barang(nama_barang, id_barang_kategori, harga, stok, harga_jual)
      VALUES(?, ?, ?, ?, ?);
    `,
      [
        req.body.nama_barang,
        req.body.id_barang_kategori,
        req.body.harga,
        req.body.stok,
        req.body.harga_jual,
      ],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json({ id_barang: rows.insertId });
      }
    );
  }
);

router.get("/categories", (req, res) => {
  connection.query(`SELECT * FROM barang_kategori;`, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});

router.put(
  "/:id_barang",
  requireParams([
    "nama_barang",
    "id_barang_kategori",
    "harga",
    "stok",
    "harga_jual",
  ]),
  requireRoles(["admin"]),
  (req, res) => {
    connection.query(
      `
        UPDATE barang SET
        nama_barang = ?, id_barang_kategori = ?, harga = ?, stok = ?, harga_jual = ?
        WHERE id_barang = ?
      `,
      [
        req.body.nama_barang,
        req.body.id_barang_kategori,
        req.body.harga,
        req.body.stok,
        req.body.harga_jual,
        req.params.id_barang,
      ],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        res.sendStatus(200);
      }
    );
  }
);

router.delete("/:id_barang", requireRoles(["admin"]), (req, res) => {
  connection.query(
    `DELETE FROM barang WHERE id_barang = ?`,
    [req.params.id_barang],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      res.sendStatus(200);
    }
  );
});

module.exports = router;
