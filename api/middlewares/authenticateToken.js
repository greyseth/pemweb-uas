const jwt = require("jsonwebtoken");

// Middleware untuk autentikasi token JWT untuk setiap aksi
const authenticateToken = (req, res, next) => {
  if (req.path.includes("/login")) return next();

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Invalid authorization token" });

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: err });

    req.id_user = user.id_user;
    req.role = user.role;
    next();
  });
};

module.exports = authenticateToken;
