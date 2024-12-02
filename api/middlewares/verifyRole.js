const connection = require("../util/db");

const verifyRole = (req, res, next) => {
  if (req.path.includes("/login")) return next();

  if (!req.id_user || !req.role)
    return res.status(401).json({ error: "Failed to authenticate access" });

  connection.query(
    `
        SELECT id_user, role FROM akses_user WHERE id_user = ? AND role = ?
        `,
    [req.id_user, req.role],
    (err, rows, fields) => {
      if (err) return res.status(500).json({ error: err });
      if (rows.length < 1)
        return res.status(401).json({ error: "Failed to verify role" });

      next();
    }
  );
};

module.exports = verifyRole;
