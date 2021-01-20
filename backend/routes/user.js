//Initialisation du router
const express = require('express');
const router = express.Router();

//Import du code métier
const userCtrl = require('../controllers/user');

//Définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;