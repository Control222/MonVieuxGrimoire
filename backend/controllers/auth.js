const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de l'utilisateur." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Vérifie que les champs ne sont pas vides
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Login/Mot de passe incorrect." });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Login/Mot de passe incorrect." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      userId: user._id,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur. Veuillez réessayer." });
  }
};
