const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/optimizeImage");
const booksController = require("../controllers/books");

router.get("/", booksController.getAllBooks);
router.get("/bestrating", booksController.getBestRatedBooks);
router.get("/:id", booksController.getById);

router.post("/", auth, multer, sharp, booksController.createBook);
router.put("/:id", auth, multer, sharp, booksController.updateBook);
router.delete("/:id", auth, booksController.deleteBook);

router.post("/:id/rating", auth, booksController.rateBook);

module.exports = router;
