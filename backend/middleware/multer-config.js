const multer = require("multer");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];

    if (!extension) {
      return callback(new Error("Type de fichier non autorisé"), false);
    }

    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

module.exports = multer({ storage }).single("image");
