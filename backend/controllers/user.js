//Import des packages
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


//Inscription
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user_email = req.body.email
            protect_email = function () {
                let splitted = user_email.split("@");
                let part1 = splitted[0];
                let avg = part1.length / 2;
                part1 = part1.substring(0, (part1.length - avg));
                part2 = splitted[1];
                return part1 + "...@" + part2;
            };
            const user = new User({
                email: protect_email(),
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //Compare le mot de passe envoyer par le frontend avec le mot de passe dans la collection User
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        //Signe un token avec jsonwebtoken  
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};
