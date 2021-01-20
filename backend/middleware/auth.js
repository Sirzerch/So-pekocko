//Import des packages
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  //Try...catch pour gérer les erreurs
  try {
    //Récupère le token du header de la req
    const token = req.headers.authorization.split(' ')[1];
    //On décode le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};