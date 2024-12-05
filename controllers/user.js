const jwt = require("jsonwebtoken"); // Bibliothèque jsonwebtoken pour la gestion de jetons de connexion sécurisés
const bcrypt = require("bcrypt"); // Bibliothèque bcrypt pour le cryptage de mots de passe
const User = require("../models/User");

exports.signup = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((UserAlreadyExist) => {
      // Vérification de l'existence d'un utilisateur existant avec l'email fourni (éviter les doublons d'ID)
      if (UserAlreadyExist) {
        return res.status(400).json({
          error: "L'adresse email que vous avez entrée est déjà utilisée.",
        });
      }

      bcrypt
        .hash(req.body.password, 10) // Chiffrement sécurisé du mot de passe par multiples hachages
        .then((hash) => {
          // Enregistrement de l'email et du mot de passe crypté du nouvel utilisateur
          const user = new User({
            email: req.body.email,
            password: hash,
          });

          user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Renvoi du succès de la création de l'utilisateur au client
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error })); // Renvoi de l'échec de la création de l'utilisateur au client
    })
    .catch((error) => res.status(500).json({ error })); // Renvoi d'une erreur au client
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Vérification de l'existence de l'email utilisateur dans la BDD
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // Comparaison du mot de passe saisie par l'utilisateur avec le mot de passe de la BDD
        .then((valid) => {
          // Vérification de la validité du mot de passe
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Génération d'un jeton d'authentification sécurisé avec une durée de validité
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error })); // Renvoi d'une erreur au client
    })
    .catch((error) => res.status(500).json({ error })); // Renvoi d'une erreur au client
};
