# CollabWrite Frontend

Frontend de l'application CollabWrite, une application de rédaction collaborative en temps réel construite avec React, TypeScript et Tailwind CSS.

## 🚀 Technologies utilisées

- **React 19** - Framework JavaScript pour l'interface utilisateur
- **TypeScript** - Langage de programmation typé
- **Vite** - Outil de build rapide et moderne
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router DOM** - Routage côté client
- **Axios** - Client HTTP pour les requêtes API

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. Clonez le repository :
```bash
git clone <url-du-repository>
cd collabwrite/collabwrite-frontend
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
Le serveur de développement sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```
Les fichiers de production seront générés dans le dossier `dist/`

### Prévisualisation du build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Structure du projet

```
src/
├── assets/          # Images et ressources statiques
├── components/      # Composants React réutilisables
├── pages/          # Pages de l'application
├── hooks/          # Hooks personnalisés
├── utils/          # Fonctions utilitaires
├── types/          # Définitions TypeScript
├── App.tsx         # Composant principal
├── main.tsx        # Point d'entrée de l'application
└── index.css       # Styles globaux avec Tailwind CSS
```

## 🎨 Styling

Le projet utilise Tailwind CSS pour le styling. Les classes Tailwind peuvent être utilisées directement dans les composants JSX.

Exemple :
```tsx
<h1 className="text-3xl font-bold text-blue-600">
  Titre stylé avec Tailwind
</h1>
```

## 🔧 Configuration

- **Vite** : `vite.config.ts`
- **TypeScript** : `tsconfig.json`
- **Tailwind CSS** : `tailwind.config.js`
- **PostCSS** : `postcss.config.js`
- **ESLint** : `eslint.config.js`

## 📝 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise le build de production
- `npm run lint` - Exécute le linter ESLint

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.