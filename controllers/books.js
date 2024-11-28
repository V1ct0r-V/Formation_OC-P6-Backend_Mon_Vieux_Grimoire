const Book = require("../models/Book");

/* Lire les données de tous les livres (GET /)*/
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error: error }));
};

/* Lire les données d'un livre (GET /:id)*/
exports.getOneBook = (req, res, next) => {
  Book.findOne({ id: req.params.id })
    .then((book) => res.status(201).json(book))
    .catch((error) => res.status(400).json({ error: error }));
};

/* Créer les données d'un nouveau livre (POST /:id) */
exports.createBook = (req, res, next) => {
  delete req.body.id;
  const book = new Book({
    ...req.body /* Opérateur spread = "..." = copie de tous les éléments de req.body*/,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

/* Modification des données d'un livre (PUT /:id) */
exports.modifyBook = (req, res, next) => {
  Book.updateOne({ id: req.params.id }, { ...req.body, id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error: error }));
};

/* Suppression des données d'un livre (DELETE /:id)*/
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
