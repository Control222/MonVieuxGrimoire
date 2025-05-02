const Book = require("../models/books");
const fs = require("fs").promises;

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Erreur récupération livres :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Erreur récupération livre :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    const bestBooks = await Book.find()
      .sort({ averageRating: -1 }) // Sort highest rating
      .limit(3); // Limit to top 3

    res.status(200).json(bestBooks);
  } catch (error) {
    console.error("Erreur récupération meilleurs livres :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);

    //Supprimer id/userId
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      averageRating: 0,
      ratings: [],
    });

    await book.save();
    res.status(201).json({ message: "Livre enregistré !" });
  } catch (error) {
    console.error("Erreur création livre:", error);
    res.status(400).json({ message: "Erreur lors de la création du livre." });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookObject = req.file
      ? // Si il y a une nouvelle image
        {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : //Sinon
        { ...req.body };

    delete bookObject._userId;

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé." });
    }

    if (req.file) {
      // Si il y a une nouvelle image, supprimer l'ancienne
      try {
        await fs.unlink(`images/${filename}`);
      } catch (error) {
        console.log("Image ancienne non trouvée:", error.message);
      }
    }

    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );

    res.status(200).json({ message: "Livre modifié !" });
  } catch (error) {
    console.error("Erreur modification livre:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Livre non trouvé." });
    if (book.userId !== req.auth.userId)
      return res.status(403).json({ message: "Non autorisé." });

    const filename = book.imageUrl.split("/images/")[1];

    try {
      await fs.unlink(`images/${filename}`);
    } catch (error) {
      console.log("Image non trouvée ou déjà supprimée :", error.message);
    }

    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Livre supprimé !" });
  } catch (error) {
    console.error("Erreur suppression livre :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.auth.userId;

    // Vérification des données envoyées
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Données invalides." });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé." });
    }

    // Vérifier si l'utilisateur a déjà noté
    const alreadyRated = book.ratings.find((r) => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
    }

    book.ratings.push({ userId, grade: rating });

    // Recalculer la moyenne
    const total = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = total / book.ratings.length;

    await book.save();

    res.status(201).json({ message: "Note noté avec succès." });
  } catch (error) {
    console.error("Erreur lors de la notation :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
