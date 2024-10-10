const { expressjwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;

  return expressjwt({
    secret,
    algorithms: ["HS256"],
    requestProperty: "user",
    isRevoked,
  }).unless({
    path: [
      { url: /\/register/, methods: ["POST", "OPTIONS"] }, // Allow POST and OPTIONS for register
      { url: /\/login/, methods: ["POST", "OPTIONS"] }, // Allow POST and OPTIONS for login
    ],
  });
}

async function isRevoked(req, token) {
  if (!token.payload.isAdmin) {
    if (req.path === "/upload" || req.path === "/admins") {
      return false;
    }
    return true;
  }
  return false;
}

module.exports = authJwt;
