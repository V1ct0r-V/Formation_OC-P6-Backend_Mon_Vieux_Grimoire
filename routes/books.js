const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const booksCtrl = require("../controllers/books");

// Définition des routes concernant les livres :
router.get("/", booksCtrl.getAllBooks); // Obtention de la liste de tous les livres de la BDD
router.get("/bestrating", booksCtrl.getBestRating); // Obtention de la liste des 3 livres les mieux notés de la BDD
router.get("/:id", booksCtrl.getOneBook); // Obtention du livre correspondant à l'identifiant envoyé
router.post("/", auth, multer, booksCtrl.createBook); // Création d'un livre
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Modification d'un livre que l'on a créé
router.delete("/:id", auth, booksCtrl.deleteBook); // Suppression d'un livre que l'on a créé
router.post("/:id/rating", auth, booksCtrl.rateBook); // Notation d'un livre

module.exports = router;
