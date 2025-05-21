const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Format invalide." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = { userId: decodedToken.userId };

    next();
  } catch (error) {
    console.error("Erreur de vérification du token :", error);
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
};
