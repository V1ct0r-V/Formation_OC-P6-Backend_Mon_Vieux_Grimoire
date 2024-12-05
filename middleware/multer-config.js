const multer = require("multer"); // Bibliothèque multer pour gérer l'upload de fichier via des requêtes HTTP

// Définition des types MIME acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images"); // Définition du repertoire de stockage avec la fonction callback(erreur, chemin du répertoire)
  },
  filename: (req, file, callback) => {
    // Renommage des fichiers avec un nom standardisé et unique
    const name = file.originalname.split(" ").join("_"); // Remplacement des espaces par des underscores (évite les bugs à l'enregistrement)
    const extension = MIME_TYPES[file.mimetype]; // Ajout d'une extension en fonction du type de l'image
    callback(null, name + Date.now() + "." + extension); // Définition du nom du fichier avec la fonction callback(erreur, nom complet du fichier)
  },
});

module.exports = multer({ storage: storage }).single("image"); // Configuration du middleware pour le stockage d'un seul fichier à la fois.
