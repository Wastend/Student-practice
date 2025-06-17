const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Необходима авторизация" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Недействительный токен" });
    req.user = user;
    next();
  });
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Нет доступа" });
    }

    next();
  };
};

module.exports = { authenticateToken, checkRole };