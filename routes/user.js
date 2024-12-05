const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// Définition des routes concernant les utilisateurs :
router.post("/signup", userCtrl.signup); // Inscription de l'utilisateur
router.post("/login", userCtrl.login); // Connexion de l'utilisateur préalablement inscrit

module.exports = router;
