//Import des packages
const Sauce = require('../models/sauce');
const fs = require('fs');

//Création d'une sauce
exports.createSauce = (req, res, next) => {
    //Parse les données recues (objet) du frontend 
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        userLiked: [],
        userDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
}

//Récupère l'intégralité des éléments de la "collection" Sauce
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Récupère une élément de la "collection" Sauce en comparant l'id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
}

//Modifie une élément de la "collection" Sauce
exports.modifySauce = (req, res, next) => {
    const reqFile = req.file
    //S'il y a une image
    if (reqFile) {
        const sauceObject = JSON.parse(req.body.sauce);
        //On supprime l'image déjà existante
        Sauce.findOne({ _id: req.params.id })
            .then(thing => {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    //On met à jour 
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            })
    } else {
        Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            .catch(error => res.status(400).json({ error }));
    }
}

//Récupère une élément de la "collection" Sauce en comparant l'id
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //Récupère le nom du fichier de l'image et la supprime
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
    //Récupère les données du frontend
    const uid = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .exec((error, sauce) => {
            let msg = "";
            //Récupère le premier indice correspondant
            let uiL = sauce.usersLiked.indexOf(uid);
            let uiD = sauce.usersDisliked.indexOf(uid);
            
            if (like == 0 && uiL > -1) {

                sauce.likes--;
                sauce.usersLiked.splice(uiL, 1);
                msg = "Unliked !";

            } else if (like == 0 && uiD > -1) {

                sauce.dislikes--;
                sauce.usersDisliked.splice(uiD, 1);
                msg = "Undisliked !";

            };

            if (like == 1) {

                sauce.likes++;
                if (sauce.usersLiked.length == 0) {
                    sauce.usersLiked = [uid];

                } else {
                    sauce.usersLiked.push(uid);
                }
                msg = "Like pris en compte !";
            };

            if (like == -1) {

                sauce.dislikes++;
                if (sauce.usersDisliked.length == 0) {
                    sauce.usersDisliked = [uid];
                } else {
                    sauce.usersDisliked.push(uid);
                }
                msg = "DisLike pris en compte !";

            };
            sauce.save()
                .then(() => res.status(201).json({ message: msg }))
                .catch(error => res.status(400).json({ error }));
        });
};