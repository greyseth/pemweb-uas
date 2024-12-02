const jwt = require("jsonwebtoken");

function generateToken(id_user, role) {
  return jwt.sign({ id_user: id_user, role: role }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

module.exports = generateToken;
