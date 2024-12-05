const jwt = require("jsonwebtoken");

/* Vérification de la connexion de l'utilisateur */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Récupère le token JWT envoyé par le client dans l'en-tête HTTP Authorization.
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Vérification de la validité du token
    const userId = decodedToken.userId; // Récupération de l'identifiant déchiffré de l'utilisateur
    req.auth = {
      userId: userId,
    };
    next(); // Permet le passage de l'userID au middleware suivant si le token est valide
  } catch (error) {
    res.status(401).json({ error }); // Sinon, renvoi une erreur 401 ("Non autorisé")
  }
};
