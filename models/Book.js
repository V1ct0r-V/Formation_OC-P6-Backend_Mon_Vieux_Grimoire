const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true, min: 1, max: 5 },
});

const BookSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message:
        "{VALUE} n'est pas un nombre valide pour définir l'année de sortie du livre.",
    },
  },
  genre: { type: String, required: true },
  ratings: [RatingSchema],
  averageRating: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("Book", BookSchema);
