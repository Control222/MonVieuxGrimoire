const Book = require("../models/books");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Erreur lors de la récupération des livres :", error);
    res.status(500).json({ message: "Impossible de récupérer les livres" });
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
    console.error("Erreur lors de la récupération du livre :", error);
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
    console.error(
      "Erreur lors de la récupération des meilleurs livres :",
      error
    );
    res.status(500).json({ message: "Erreur serveur." });
  }
};
