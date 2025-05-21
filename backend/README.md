# Mon Vieux Grimoire

API REST pour le site de référencement et de notation de livres “Mon Vieux Grimoire”, développé pour une chaîne de librairies à Lille.

## Description

Ce projet constitue la partie back-end d’un site permettant aux membres :

- d’ajouter de nouveaux livres,
- de noter les ouvrages,
- de consulter les notes moyennes attribuées par les utilisateurs.

Le back-end gère l’authentification, la gestion des livres, la notation, ainsi que l’optimisation et la gestion des images associées aux livres.

## Technologies utilisées

- Node.js
- Express
- MongoDB / Mongoose
- JWT pour l’authentification
- Bcrypt pour le hachage des mots de passe
- Multer pour la gestion des fichiers
- Sharp pour l’optimisation des images

## Installation

1.  Cloner le dépôt :

```
git clone https://github.com/Control222/MonVieuxGrimoire.git
cd MonVieuxGrimoire
```

2. Installer les dépendances :

```
npm install
```

3. Lancer le serveur :

```
npm run dev
```

## Variables d'environnement

Créez un fichier .env dans la racine du projet et ajoutez les variables d'environnement suivantes :

```
MONGODB_URI=<url de ta base MongoDB>
JWT_SECRET=<clé secrète pour les tokens>
BASE_URL=http://localhost:4000
```

## Routes de l'API

1. Authentification

- POST /api/auth/signup : inscription
- POST /api/auth/login : connexion

2. Gestion des livres

- GET /api/books : Récupère tous les livres
- GET /api/books/:id : Récupère un livre par son ID
- GET /api/books/bestrating : Récupère les 3 livres les mieux notés
- POST /api/books : Ajoute un nouveau livre
- PUT /api/books/:id : Met à jour un livre
- DELETE /api/books/:id : Supprime un livre
- POST /api/books/:id/rating : Ajoute une note à un livre
