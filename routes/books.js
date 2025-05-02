const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const booksController = require("../controllers/books");

router.get("/", booksController.getAllBooks);
router.get("/:id", booksController.getById);
router.get("/bestrating", booksController.getBestRatedBooks);

router.post("/", auth, multer, booksController.createBook);
router.put("/:id", auth, multer, booksController.updateBook);
router.delete("/:id", auth, booksController.deleteBook);

router.post("/:id/rating", auth, booksController.rateBook);

module.exports = router;
