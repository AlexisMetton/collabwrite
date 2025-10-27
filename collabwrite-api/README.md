# CollabWrite API

API backend de l'application CollabWrite, une application de rédaction collaborative en temps réel construite avec Node.js, Express et TypeScript.

## 🚀 Technologies utilisées

- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web pour Node.js
- **TypeScript** - Langage de programmation typé
- **Nodemon** - Outil de développement pour redémarrer automatiquement le serveur
- **ts-node** - Exécution TypeScript directe sans compilation

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. Naviguez vers le dossier API :
```bash
cd collabwrite-api
```

2. Installez les dépendances :
```bash
npm install
```

## 🏃‍♂️ Lancement du projet

### Mode développement
```bash
npm run dev
```
Le serveur de développement sera accessible sur `http://localhost:3000` (port par défaut)

### Build TypeScript
```bash
npm run build
```
Compile le code TypeScript vers JavaScript dans le dossier `dist/`

### Lancement en production
```bash
npm start
```

### Tests
```bash
npm test
```

## 📁 Structure du projet

```
src/
├── controllers/    # Contrôleurs pour gérer les requêtes
├── models/         # Modèles de données
├── routes/         # Définition des routes API
├── middleware/     # Middlewares personnalisés
├── utils/          # Fonctions utilitaires
├── types/          # Définitions TypeScript
├── config/         # Configuration de l'application
├── app.ts          # Configuration Express
└── server.ts       # Point d'entrée du serveur
```

## 🔧 Configuration

- **TypeScript** : `tsconfig.json`
- **Package** : `package.json`
- **Environment** : `.env` (à créer)

## 📝 Scripts disponibles

- `npm run dev` - Lance le serveur en mode développement avec nodemon
- `npm run build` - Compile le TypeScript vers JavaScript
- `npm start` - Lance l'application en production
- `npm test` - Exécute les tests

## 🌐 Endpoints API

### Base URL
```
http://localhost:3000/api
```

### Routes principales
- `GET /api/health` - Vérification de l'état du serveur
- `POST /api/documents` - Créer un nouveau document
- `GET /api/documents/:id` - Récupérer un document
- `PUT /api/documents/:id` - Mettre à jour un document
- `DELETE /api/documents/:id` - Supprimer un document

## 🔐 Variables d'environnement

Créez un fichier `.env` à la racine du dossier API :

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/collabwrite
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

## 🗄️ Base de données

L'API est conçue pour fonctionner avec MongoDB. Assurez-vous d'avoir MongoDB installé et en cours d'exécution.

## 🚀 Déploiement

### Avec PM2
```bash
npm install -g pm2
npm run build
pm2 start dist/server.js --name collabwrite-api
```

### Avec Docker
```bash
docker build -t collabwrite-api .
docker run -p 3000:3000 collabwrite-api
```

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
