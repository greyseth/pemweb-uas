const express = require("express");
const requireParams = require("../middlewares/requireParams");
const requireRoles = require("../middlewares/requireRoles");
const connection = require("../util/db");
const router = express.Router();

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

          console.log(req.body.barang);
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

router.get("/customer", requireRoles(["kasir"]), (req, res) => {
  connection.query(`SELECT * FROM customer;`, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});

router.get("/supplier", requireRoles(["kasir"]), (req, res) => {
  connection.query(`SELECT * FROM supplier;`, (err, rows, fields) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(rows);
  });
});

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
