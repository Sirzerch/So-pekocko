const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
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

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
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
    const uid = req.body.userId;
    const like = req.body.like;

    Sauce.findOne({ _id: req.params.id })
        .exec((error, sauce) => {
            let msg = "";
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