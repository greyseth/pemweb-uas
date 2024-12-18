const express = require("express");
const requireParams = require("../middlewares/requireParams");
const requireRoles = require("../middlewares/requireRoles");
const connection = require("../util/db");
const router = express.Router();

// Pembuatan pemesanan (penjualan/pembelian)
router.post(
  "/",
  requireRoles(["kasir"]),
  requireParams(["id_transactor", "order_type", "barang"]),
  (req, res) => {
    // order_type: 'pembelian' || 'penjualan'
    // barang: [{id_barang, qty}]

    connection.beginTransaction((err) => {
      if (err)
        return connection.rollback(() => res.status(500).json({ error: err }));

      // Tambahkan data tabel pembelian/penjualan
      connection.query(
        `INSERT INTO ${req.body.order_type} (tanggal, id_${
          req.body.order_type === "pembelian" ? "supplier" : "customer"
        }) VALUES(NOW(), ?)`,
        [req.body.id_transactor],
        (err, rows, fields) => {
          if (err)
            return connection.rollback(() =>
              res.status(500).json({ error: err })
            );

          const id_order = rows.insertId;

          // Tambahkan data ke detail pembelian/penjualan
          const barangs = req.body.barang.map((b) => {
            return [id_order, b.id_barang, b.qty];
          });
          connection.query(
            `INSERT INTO detail_${req.body.order_type} (id_${req.body.order_type}, id_barang, qty) VALUES ?`,
            [barangs],
            (err, rows, fields) => {
              if (err)
                return connection.rollback(() =>
                  res.status(500).json({ error: err })
                );

              connection.commit((err) => {
                if (err)
                  return connection.rollback(() =>
                    res.status(500).json({ error: err })
                  );

                res.status(200).json({ id_order: id_order });
              });
            }
          );
        }
      );
    });
  }
);

// Ambil data dan tambah customer
router.get("/customer", (req, res) => {
  connection.query(`SELECT * FROM customer;`, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});
router.post(
  "/customer",
  requireRoles(["admin"]),
  requireParams(["nama_customer", "alamat", "telepon"]),
  (req, res) => {
    connection.query(
      `INSERT INTO customer(nama_customer, alamat, telepon) VALUES(?, ?, ?)`,
      [req.body.nama_customer, req.body.alamat, req.body.telepon],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        res.sendStatus(200);
      }
    );
  }
);

// Ambil data dan tamah supplier
router.get("/supplier", (req, res) => {
  connection.query(`SELECT * FROM supplier;`, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});
router.post(
  "/supplier",
  requireRoles(["admin"]),
  requireParams(["nama_supplier", "alamat", "telepon"]),
  (req, res) => {
    connection.query(
      `INSERT INTO supplier(nama_supplier, alamat, telepon) VALUES(?, ?, ?)`,
      [req.body.nama_supplier, req.body.alamat, req.body.telepon],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        res.sendStatus(200);
      }
    );
  }
);

// Semua pesanan dalam satu jenis
router.get(
  "/:order_type",
  requireRoles(["kasir", "supervisor"]),
  (req, res) => {
    const type = req.params.order_type;
    const transactor = type === "pembelian" ? "supplier" : "customer";

    connection.query(
      `
      SELECT ${type}.id_${type}, ${transactor}.nama_${transactor}, ${type}.tanggal, SUM(detail_${type}.harga_${
        type === "penjualan" ? "jual" : "beli"
      } * detail_${type}.qty) AS harga_total
      FROM ${type}
      LEFT JOIN ${transactor} ON ${transactor}.id_${transactor} = ${type}.id_${transactor}
      LEFT JOIN detail_${type} ON detail_${type}.id_${type} = ${type}.id_${type}
      GROUP BY ${type}.id_${type};
    `,
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        res.status(200).json(rows);
      }
    );
  }
);

// Detail salah satu pesanan
router.get(
  "/:order_type/:id_order",
  requireRoles(["kasir", "supervisor"]),
  (req, res) => {
    const type = req.params.order_type;
    const transactor = type === "pembelian" ? "supplier" : "customer";
    const harga = type === "penjualan" ? "jual" : "beli";

    connection.query(
      `
      SELECT ${type}.id_${type}, ${transactor}.nama_${transactor}, ${type}.tanggal, SUM(detail_${type}.harga_${
        type === "penjualan" ? "jual" : "beli"
      } * detail_${type}.qty) AS harga_total
      FROM ${type}
      LEFT JOIN ${transactor} ON ${transactor}.id_${transactor} = ${type}.id_${transactor}
      LEFT JOIN detail_${type} ON detail_${type}.id_${type} = ${type}.id_${type}
      WHERE ${type}.id_${type} = ?
      GROUP BY ${type}.id_${type}
      LIMIT 1;
    `,
      [req.params.id_order],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });

        const orderData = rows[0];

        connection.query(
          `
          SELECT barang.nama_barang, barang.stok AS stok_barang, 
            detail_${type}.qty, detail_${type}.harga_${harga} AS harga_satuan, (detail_${type}.harga_${harga} * detail_${type}.qty) AS harga_total
          FROM detail_${type}
          LEFT JOIN barang ON barang.id_barang = detail_${type}.id_barang
          WHERE detail_${type}.id_${type} = ?
        `,
          [req.params.id_order],
          (err, rows, fields) => {
            if (err) return res.status(500).json({ error: err });

            res.status(200).json({ ...orderData, barang: rows });
          }
        );
      }
    );
  }
);

module.exports = router;
