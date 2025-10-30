## CollabWrite — Guide de démarrage

Application de rédaction collaborative en temps réel (API Node/Express + Frontend React + Service Realtime WebSocket/WebRTC).

### Prérequis
- Node.js ≥ 18 et npm
- Docker Desktop (recommandé pour lancer la base de données et l’API rapidement)

### Structure du projet
- `collabwrite-api/` — API (Express, Prisma/Postgres, authentification, emails)
- `collabwrite-frontend/` — Frontend (React + Vite)
- `collabwrite-realtime/` — Service temps réel (WebSocket/WebRTC)

---

## 1) Configuration des variables d’environnement

Créez vos fichiers `.env` à partir des exemples fournis.

### API (`collabwrite-api/.env`)
Copiez `collabwrite-api/env.example` vers `collabwrite-api/.env` puis ajustez :
- `DATABASE_URL` ou les variables `POSTGRES_*` selon votre environnement (Docker vs local)
- `JWT_SECRET` et `JWT_REFRESH_SECRET` (valeurs longues et aléatoires en production)
- `FRONTEND_URL` et `CORS_ORIGIN` (par défaut `http://localhost:5173`)
- Bloc SMTP (emails) : `NODE_MAILER_HOST/PORT/SECURE/USER/PASSWORD` et `GMAIL_USER`

Exemple Gmail (mot de passe d’application requis) :
```env
NODE_MAILER_HOST=smtp.gmail.com
NODE_MAILER_PORT=465
NODE_MAILER_SECURE=true
NODE_MAILER_USER=your.email@gmail.com
NODE_MAILER_PASSWORD=your_gmail_app_password_16_chars
GMAIL_USER=your.email@gmail.com
```

Astuce: vérifiez votre config SMTP via l’endpoint protégé `GET /api/invite/verify-config`.

### Frontend (`collabwrite-frontend/.env`)
Copiez `collabwrite-frontend/env.example` vers `collabwrite-frontend/.env` puis ajustez :
```env
VITE_API_URL=http://localhost:4000/api
VITE_CKEDITOR_LICENSE_KEY=
```
`VITE_CKEDITOR_LICENSE_KEY` : renseignez votre clé.

---

## 2) Démarrage rapide avec Docker (recommandé)

Dans `collabwrite-api/`, lancez :
```bash
docker compose up -d
```
Cela démarre Postgres et l’API. L’API écoute par défaut sur `http://localhost:4000`.

URLs utiles :
- API: `http://localhost:4000/`
- Routes API: `http://localhost:4000/api/...`

> Si vous modifiez `.env`, redémarrez les services (`docker compose down && docker compose up -d`).

---

## 3) Lancement en mode développement (sans Docker)

Dans trois terminaux séparés :

1) API
```bash
cd collabwrite-api
npm install
npm run dev
```

2) Frontend
```bash
cd collabwrite-frontend
npm install
npm run dev
# Vite démarre sur http://localhost:5173
```

3) Realtime
```bash
cd collabwrite-realtime
npm install
npm run dev
```

Assurez-vous que `VITE_API_URL` pointe vers l’API (par défaut `http://localhost:4000/api`).

---

## 4) Emails d’invitation

L’API utilise Nodemailer. Renseignez correctement les variables SMTP dans `collabwrite-api/.env`.
- Gmail : utilisez un mot de passe d’application (pas le mot de passe du compte)
- `NODE_MAILER_SECURE=true` avec le port 465 (SSL)
- `NODE_MAILER_SECURE=false` avec le port 587 (STARTTLS)
- `GMAIL_USER` doit correspondre à l’expéditeur autorisé par votre SMTP

Test rapide : appelez `GET /api/invite/verify-config` (avec un token) pour valider la connexion SMTP.

---

## 5) Comptes et accès

Un compte administrateur par défaut est créé si absent (variables dans `collabwrite-api/.env`) :
- `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`, `DEFAULT_ADMIN_NAME`

Modifiez-les en production.

---

## 6) Dépannage rapide

- Erreur 500 lors de l’envoi d’email + logs `EAUTH`/`Missing credentials for "PLAIN"` :
  - Vérifiez `NODE_MAILER_USER` et `NODE_MAILER_PASSWORD`
  - Vérifiez `NODE_MAILER_HOST/PORT/SECURE`
  - Alignez `GMAIL_USER` avec l’expéditeur autorisé
- CORS : assurez-vous que `FRONTEND_URL`/`CORS_ORIGIN` correspondent à l’URL du frontend
- Après modification d’un `.env`, redémarrez le service concerné

---

## 7) Scripts utiles

API (`collabwrite-api`) :
- `npm run dev` — mode dev (ts-node/nodemon)
- `npm run build` — build TypeScript
- `npm start` — mode production

Frontend (`collabwrite-frontend`) :
- `npm run dev` — mode dev (Vite)
- `npm run build` — build de production
- `npm run preview` — prévisualisation du build

Realtime (`collabwrite-realtime`) :
- `npm run dev` — mode dev
- `npm run build` — build de production
- `npm start` — mode production

---

Bon développement !
