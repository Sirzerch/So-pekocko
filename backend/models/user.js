//Import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Création du schéma de données pour les Utilisateurs
const userSchema = mongoose.Schema({
    userId: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Vérification d'une adresse email unique
userSchema.plugin(uniqueValidator);

//Exportation du schéma en modèle mongoose, le rendant disponible pour notre application Express
module.exports = mongoose.model('User', userSchema);
