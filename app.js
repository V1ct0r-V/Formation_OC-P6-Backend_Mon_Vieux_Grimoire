const express = require("express"); /* Import du package "express" de Node */
const mongoose = require("mongoose");

const app =
  express(); /* Appel de la méthode "express" pour créer une application "express"*/

mongoose
  .connect(
    "mongodb+srv://victorvagne:OpenClassrooms@cluster0-pme76.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/* Définition des headers pour : */
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  ); /* - accéder à notre API depuis n'importe quelle origine avec "*"  */
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); /* - ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;*/
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); /* - envoyer des requêtes avec les méthodes mentionnées ( GET, POST, etc.) */
  next();
});

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Livre créé !",
  });
});

app.get("/api/books", (req, res, next) => {
  const book = [
    {
      id: "1",
      userId: "clc4wj5lh3gyi0ak4eq4n8syr",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "2",
      userId: "clbxs3tag6jkr0biul4trzbrv",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "clbxs3tag6jkr0biul4trzbrv",
          grade: 4,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4.2,
    },
    {
      id: "3",
      userId: "1",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "4",
      userId: "1",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "5",
      userId: "1",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4,
    },
    {
      id: "6",
      userId: "1",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "7",
      userId: "1",
      title: "Milwaukee Mission",
      author: "Elder Cooper",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2021,
      genre: "Policier",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 3,
    },
    {
      id: "8",
      userId: "clc7s9xnh7zpt0ak4fisdwuj1",
      title: "Book for Esther",
      author: "Alabaster",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Paysage",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
      ],
      averageRating: 4,
    },
    {
      id: "9",
      userId: "clc4wj5lh3gyi0ak4eq4n8syr",
      title: "The Kinfolk Table",
      author: "Nathan Williams",
      imageUrl: "https://via.placeholder.com/206x260",
      year: 2022,
      genre: "Cuisine",
      ratings: [
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "1",
          grade: 5,
        },
        {
          userId: "clc4wj5lh3gyi0ak4eq4n8syr",
          grade: 1,
        },
      ],
      averageRating: 3,
    },
  ];
  res.status(200).json(book);
});

module.exports =
  app; /* Export de cette application "express" pour pouvoir y accéder depuis les autres fichiers du projet, dont le "server" Node*/
