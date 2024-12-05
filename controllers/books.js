const Book = require("../models/Book");
const fs = require("fs"); // Bibliothèque FileSystem pour interagir avec le système de fichier
const sharp = require("sharp"); // Bibliothèque Sharp pour le traitement des images

// Lire les données de tous les livres (GET /)
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

// Lire les données d'un livre (GET /:id)
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(201).json(book))
    .catch((error) => res.status(400).json({ error }));
};

// Créer les données d'un nouveau livre (POST /:id)
exports.createBook = (req, res, next) => {
  // Récupération et préparation des données du livre
  const bookObject = JSON.parse(req.body.book); // Récupération et conversion des données du livre présent dans la requête du serveur au client
  delete bookObject.userId; // Suppression de l'ID utilisateur obtenu dans la requête pour éviter les attaques par manipulation de paramètres

  // Création du nom de l'image optimisée
  const date = Date.now();
  const ImageName = req.file.filename.split(".")[0];
  const optimizedImageName = `${date}-${ImageName}.webp`;

  // Optimisation et sauvegarde de l'image grâce à la bibliothèque Sharp
  sharp(req.file.path)
    .webp({ quality: 20 }) // Format et qualité de l'image
    .resize({ width: 206, height: 260, fit: "cover" }) // Redimensionnement de l'image
    .toFile(`images/${optimizedImageName}`) // Sauvegarde de l'image optimisée dans le répertoire
    .then(() => {
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId, // Ajout de l'ID utilisateur obtenu par le serveur (voir middleware/auth.js)
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/images/${optimizedImageName}`, // Ajout de l'URL de l'image optimisée
      });
      return book.save(); // Envoi de la réponse du serveur au client
    })
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" }); // Renvoi de la confirmation d'enregistrement au client
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error }); // Renvoi d'une erreur serveur au client
    });
};

// Modification des données d'un livre (PUT /:id)
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? JSON.parse(req.body.book) : req.body;
  delete bookObject.userId;

  // Rechercher le livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      // Si l'utilisateur n'est pas autorisé à modifier le livre
      if (book.userId !== req.auth.userId) {
        return res
          .status(401)
          .json({ message: "Vous n'êtes pas autorisé à modifier ce livre." });
      }

      // Si une nouvelle image est envoyée :
      if (req.file) {
        const oldImageName = book.imageUrl.split("/images/")[1];

        // - Suppression de l'ancienne image
        fs.unlink(`images/${oldImageName}`, (error) => {
          if (error) {
            console.log(
              "Ancienne image non trouvée ou déjà supprimée :",
              error
            );
          }
        });

        // - Génération d'un nom unique pour la nouvelle image optimisée
        const date = Date.now();
        const ImageName = req.file.filename.split(".")[0];
        const optimizedImageName = `${date}-${ImageName}.webp`;

        // - Optimisation et sauvegarde de la nouvelle image
        return sharp(req.file.path)
          .webp({ quality: 20 })
          .resize({ width: 206, height: 260, fit: "cover" })
          .toFile(`images/${optimizedImageName}`)
          .then(() => {
            // MAJ de l'URL de l'image dans bookObject
            bookObject.imageUrl = `${req.protocol}://${req.get(
              "host"
            )}/images/${optimizedImageName}`;

            return Book.updateOne({ _id: req.params.id }, { ...bookObject }); // Renvoi du livre modifié dans la BDD
          });
      } else {
        // MAJ directe des données si pas de nouvelle image uploadée
        return Book.updateOne({ _id: req.params.id }, { ...bookObject });
      }
    })
    .then(() => {
      res.status(200).json({ message: "Livre modifié avec succès !" }); // Renvoi du succès de la modification au client
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error }); // Renvoi d'une erreur serveur au client
    });
};

// Suppression des données d'un livre (DELETE /:id)
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification que l'utilisateur demandant la modification est bien le créateur du livre sur le site
      if (book.userId != req.auth.userId) {
        res.status(401).json({
          message: "Vous n'êtes pas autorisé à effectuer cette action.",
        });
      } else {
        // Suppression de l'image du livre
        const ImageName = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${ImageName}`, () => {
          // Suppression du livre de la base de donnée avec la méthode deleteOne
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" }); // Renvoi de la confirmation de suppression du livre au client
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({ error }); // Renvoi de l'erreur lié à la suppression au client
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error }); // Renvoi de l'erreur au client
    });
};

// Ajout d'une note à un livre (POST /:id/rating)
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;

  // Vérification que la note est comprise entre 1 et 5
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être un nombre compris entre 1 et 5" });
  }

  // Recherche du livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérification de l'existence d'un livre associé à son ID
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérification : est-ce que l'utilisateur a déjà noté ce livre?
      const existingRating = book.ratings.find((req) => req.userId === userId);
      if (existingRating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajout de la note dans le tableau ratings
      const newRating = {
        userId: userId,
        grade: rating,
      };
      book.ratings.push(newRating);

      // Calcul de la moyenne des notes et mise à jour de cette information dans les données du livre
      const arrayRatings = book.ratings; // Tableau de toutes les notes qu'a reçu le livre
      const RatingsCount = book.ratings.length; // Nombre total de notes
      const sumRatings = arrayRatings.reduce(
        (sum, elem) => sum + elem.grade, // Fonction de rappel appelée pour chaque élément du tableau des notes avec la fonction reduce pour transformer le tableau des notes en un nombre égal à la somme de toutes les notes
        0
      );
      book.averageRating = Math.round((10 * sumRatings) / RatingsCount) / 10; // Enregistre la note moyenne du livre (avec arrondi à un chiffre après la virgule pour l'affichage sur le site)

      // Sauvegarde du livre noté
      book
        .save()
        .then((updatedBook) => {
          console.log("Le livre a été noté!");
          res.status(200).json(updatedBook); // Renvoi de la mise à jour du livre au client
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error }); // Renvoi de l'erreur au client en cas de problème de sauvegarde
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error }); // Renvoi de l'erreur au client
    });
};

// Récupération des 3 livres les mieux notés (GET /bestrating)
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: "descending" }) // Tri décroissant de la liste des livres selon le paramètre "note moyenne"
    .limit(3) // Réduction de la liste à 3 livres
    .then((list) => {
      res.status(200).json(list); // Renvoi de la liste des 3 livres les mieux notés au client
    })
    .catch((error) => {
      res.status(500).json({ error }); // Renvoi de l'erreur au client
    });
};
