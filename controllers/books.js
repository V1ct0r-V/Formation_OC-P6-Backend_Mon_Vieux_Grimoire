const Book = require("../models/Book");
const fs = require("fs");
const sharp = require("sharp");

// Lire les données de tous les livres (GET /)
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error: error }));
};

// Lire les données d'un livre (GET /:id)
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(201).json(book))
    .catch((error) => res.status(400).json({ error: error }));
};

// Créer les données d'un nouveau livre (POST /:id)
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject.userId;

  // Optimisation de l'image
  const date = Date.now();
  const ImageName = req.file.filename.split(".")[0];
  const optimizedImageName = `${date}-${ImageName}.webp`;

  sharp(req.file.path)
    .webp({ quality: 20 })
    .toFile(`images/${optimizedImageName}`) // Sauvegarde de l'image optimisée
    .then(() => {
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get(
          "host"
        )}/images/${optimizedImageName}`,
      });
      return book.save();
    })
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Modification des données d'un livre (PUT /:id)
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? { ...JSON.parse(req.body.book) }
    : { ...req.body };

  delete bookObject.userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Suppression de l'ancienne image
      const oldFilename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${oldFilename}`, (err) => {
        if (err)
          console.warn("Ancienne image non trouvée ou déjà supprimée :", err);
      });

      // Optimisation de l'image
      const date = Date.now();
      const ImageName = req.file.filename.split(".")[0];
      const optimizedImageName = `${date}-${ImageName}.webp`;

      return sharp(req.file.path)
        .webp({ quality: 20 })
        .toFile(`images/${optimizedImageName}`)
        .then(() => {
          // Mise à jour de l'URL de l'image
          bookObject.imageUrl = `${req.protocol}://${req.get(
            "host"
          )}/images/${optimizedImageName}`;

          return Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          );
        });
    })
    .then(() => {
      res.status(200).json({ message: "Livre modifié avec succès !" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Suppression des données d'un livre (DELETE /:id)
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Notation d'un livre (POST /:id/rating)
exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;

  // Vérification que la note est comprise entre 1 et 5
  if (rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "La note doit être comprise entre 1 et 5" });
  }

  // Recherche du livre par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find((req) => req.userId === userId);
      if (existingRating) {
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre" });
      }

      // Ajouter la note au tableau ratings
      const newRating = {
        userId: userId,
        grade: rating,
      };
      book.ratings.push(newRating);

      // Mise à jour de la moyenne
      const arrayRatings = book.ratings; // Tableau des notes
      const RatingsCount = book.ratings.length; // Nombre total de notes
      const sumRatings = arrayRatings.reduce(
        (sum, elem) => sum + elem.grade, // Fonction de rappel appelé pour chaque élément du tableau des notes avec la fonction reduce pour transformer le tableau en un objet
        0
      );
      book.averageRating = Math.round((10 * sumRatings) / RatingsCount) / 10; // Donne la note moyenne arrondi à un chiffre après la virgule pour l'affichage

      // Sauvegarde du livre MAJ
      book
        .save()
        .then((updatedBook) => {
          res.status(200).json(updatedBook);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

// Récupération des 3 livres les mieux notés (GET)
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: "descending" }) // Tri décroissant par averageRating
    .limit(3) // Limite à 3 livres
    .then((liste) => {
      res.status(200).json(liste); // Retourne les livres avec les meilleures notes
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
