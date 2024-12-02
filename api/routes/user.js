const express = require("express");
const requireParams = require("../middlewares/requireParams");
const connection = require("../util/db");
const generateToken = require("../util/generateToken");
const requireRoles = require("../middlewares/requireRoles");
const router = express.Router();

router.post("/login", requireParams(["username", "password"]), (req, res) => {
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

      res.status(200).json({
        success: true,
        data: {
          auth_token: generateToken(rows[0].id_user, rows[0].role),
          username: req.body.username,
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
    connection.beginTransaction((err) => {
      if (err)
        return connection.rollback(() => res.status(500).json({ error: err }));

      connection.query(
        `INSERT INTO user(username, password) VALUES(?, ?)`,
        [req.body.username, req.body.password],
        (err, rows, fields) => {
          if (err)
            return connection.rollback(() =>
              res.status(500).json({ error: err })
            );

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
