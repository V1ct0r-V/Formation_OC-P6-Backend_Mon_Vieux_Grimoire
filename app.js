/* Création d'une application "Express" */
const express = require("express");
const app = express();

/* Connexion à MongoDB */
const mongoose = require("mongoose");
require("dotenv").config();
const env = process.env;
mongoose
  .connect(
    `mongodb+srv://${env.ID}:${env.PSWD}@monvieuxgrimoire.5tecy.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire`
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Import des routes et des données */
const booksRoutes = require("./routes/books.js");
const userRoutes = require("./routes/user.js");
const path = require("path");

/* Configuration des headers de l'application pour : */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  ); /* 1) accéder à notre API depuis n'importe quelle origine avec "*"  */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); /* 2) ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;*/
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); /* 3) envoyer des requêtes avec les méthodes mentionnées ( GET, POST, etc.) */
  next();
});

/* Middleware pour parser les données JSON */
app.use(express.json());

/* Configuration des routeurs de l'application */
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

module.exports =
  app; /* Export de cette application "express" pour pouvoir y accéder depuis les autres fichiers du projet, dont le "server" Node*/
