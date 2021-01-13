P6_Construisez une API sécurisée pour une application d'avis gastronomiques

[présentation]

Il s'agit d'un projet de création d'API sécurisée pour une application d'avis gastronomiques, elle contient :

    Un système d'authentification renforcée
    Un mot de passe chiffré
    Une requête de liste des sauces sur la page principale
    Un module d'ajout de sauce
    Un module de modification/suppresion de sauce
    Un système de "Like/Dislike"

[prérequis]

    Il vous faudra ANGULAR CLI pour pouvoir faire fonctionner le serveur de développement sur lequel est éxécuté le code frontend.

    Vous devrez également installer Node.js ainsi que NPM (https://www.npmjs.com/package/npm) avec les packages suivants (en local avec la commande --save) :

        cors , mongoose, mongoose-unique-validator, body-parser, express, jsonwebtoken, multer, fs, bcrypt.

[configuration]

    Pour démarrer le serveur, il vous faut executer server.js. Pour cela, depuis le sous-répertoire (dossier) 'backend' executez la commande :

    $node server.js

Celui-ci devrait éxecuter une instance du serveur sur le port 3000.

    Vous devez également charger l'interface graphique (GUI). Pour cela, depuis le sous répertoire (dossier) 'frontend' executez la commande :

    $ng serve

Celui-ci devrait éxecuter une instance du serveur sur le port 4200.

[utilisation]

    Une fois que tous les modules sont chargés/compilés;

    Depuis votre navigateur internet veuillez vous rendre à l'URL suivante : http://localhost:4200/
