//Import des packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Ajout des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Initialisation d'express
const app = express();

//Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://James:1234@cluster0.fum0c.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Configure et autorise les requêtes Multi-Origin; définit les Headers & les Methodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//Permet d'extraire l'objet JSON
//Défini comme middleware global pour l'application
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
//Enregistre notre routeur pour toutes les demandes effectuées vers /api/auth
app.use('/api/auth', userRoutes);
//Enregistre notre routeur pour toutes les demandes effectuées vers /api/sauces
app.use('/api/sauces', sauceRoutes);


module.exports = app;