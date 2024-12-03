const connection = require("../util/db");

// Middleware untuk mengecek role user
function requireRoles(roles) {
  return (req, res, next) => {
    connection.query(
      `SELECT role FROM akses_user WHERE id_user = ?`,
      [req.id_user],
      (err, rows, fields) => {
        if (err) return res.status(500).json({ error: err });
        if (rows.length < 1)
          return res.status(401).json({ error: "Role not found" });

        if (roles.includes(rows[0].role)) next();
        else res.status(401).json({ error: "Unauthorized access" });
      }
    );
  };
}

module.exports = requireRoles;
