require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connecté à MongoDB Atlas !"))
  .catch((err) => console.error("Erreur de connexion", err));

const PORT = 4000;

app.use(express.json());

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
