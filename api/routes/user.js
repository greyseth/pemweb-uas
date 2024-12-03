const express = require("express");
const requireParams = require("../middlewares/requireParams");
const connection = require("../util/db");
const generateToken = require("../util/generateToken");
const requireRoles = require("../middlewares/requireRoles");
const router = express.Router();

router.post("/login", requireParams(["username", "password"]), (req, res) => {
  // Select user dengan username dan password
  connection.query(
    `
      SELECT user.id_user, akses_user.role FROM user
      LEFT JOIN akses_user ON akses_user.id_user = user.id_user
      WHERE username = ? AND password = ?
      LIMIT 1;
    `,
    [req.body.username, req.body.password],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length < 1) return res.status(200).json({ success: false });

      // Mengembalikan token JWT
      res.status(200).json({
        success: true,
        data: {
          auth_token: generateToken(rows[0].id_user, rows[0].role),
          username: req.body.username,
          role: rows[0].role,
        },
      });
    }
  );
});

router.post(
  "/register",
  requireParams(["username", "password", "role"]),
  requireRoles(["admin"]),
  (req, res) => {
    // Menggunakan transaction karena lebih dari 1 operasi insert
    connection.beginTransaction((err) => {
      if (err)
        return connection.rollback(() => res.status(500).json({ error: err }));

      // Menambahkan user baru
      connection.query(
        `INSERT INTO user(username, password) VALUES(?, ?)`,
        [req.body.username, req.body.password],
        (err, rows, fields) => {
          if (err)
            return connection.rollback(() =>
              res.status(500).json({ error: err })
            );

          // Menambahkan ke tabel akses user
          const id_user = rows.insertId;
          connection.query(
            `INSERT INTO akses_user(id_user, role) VALUES(?, ?)`,
            [id_user, req.body.role],
            (err, rows, fields) => {
              if (err)
                return connection.rollback(() =>
                  res.status(500).json({ error: err })
                );

              connection.commit((err) => {
                if (err)
                  connection.rollback(() =>
                    res.status(500).json({ error: err })
                  );

                res.status(200).json({ id_user: id_user });
              });
            }
          );
        }
      );
    });
  }
);

// Mengambil data sendiri (untuk header)
router.get("/self", (req, res) => {
  connection.query(
    `
      SELECT user.username, akses_user.role 
      FROM user 
      LEFT JOIN akses_user ON akses_user.id_user = user.id_user
      WHERE user.id_user = ? AND akses_user.role = ?
      LIMIT 1;
    `,
    [req.id_user, req.role],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(rows[0]);
    }
  );
});

// Data semua user
router.get("/all", requireRoles(["admin"]), (req, res) => {
  connection.query(
    `
      SELECT user.*, akses_user.role FROM user LEFT JOIN akses_user ON akses_user.id_user = user.id_user;
    `,
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json(rows);
    }
  );
});

// Update data user
router.put(
  "/:id_user",
  requireRoles(["admin"]),
  requireRoles(["username", "password", "role"]),
  (req, res) => {
    connection.beginTransaction((err) => {
      if (err)
        return connection.rollback(() => res.status(500).json({ error: err }));

      connection.query(
        `UPDATE user SET username = ?, password = ? WHERE id_user = ?`,
        [req.body.username, req.body.password, req.params.id_user],
        (err, rows, fields) => {
          if (err)
            return connection.rollback(() =>
              res.status(500).json({ error: err })
            );

          connection.query(
            `UPDATE akses_user SET role = ? WHERE id_user = ?`,
            [req.body.role, req.params.id_user],
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

                res.sendStatus(200);
              });
            }
          );
        }
      );
    });
  }
);

module.exports = router;
