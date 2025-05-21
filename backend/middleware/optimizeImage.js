const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const inputPath = req.file.path;
    const outputFilename =
      "compressed_" + path.parse(req.file.filename).name + ".jpeg";
    const outputPath = path.join("images", outputFilename);

    await sharp(inputPath)
      .resize({ width: 800 }) // Redimensionne en px
      .toFormat("jpeg", { quality: 80 }) // Comrpession qualité 80%
      .toFile(outputPath);

    // Supprime l'image originale
    fs.unlinkSync(inputPath);

    // Remplace le chemin par la version compressée
    req.file.filename = outputFilename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error("Erreur lors de la compression image avec Sharp :", error);
    return res.status(500).json({ message: "Erreur d'optimisation d'image" });
  }
};
