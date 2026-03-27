# NGO — DBMS Mini Project

Express + EJS + MongoDB web application for NGO operations (services, volunteers, budget, FAQs, authentication).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/) running locally (default URI in code: `mongodb://localhost/ngo_app`)

## Setup

```bash
npm install
```

Create a `.env` file from the example:

```bash
copy .env.example .env
```

Edit `.env` and set `ADMIN` to the admin username you use in the app.

## Run

```bash
npm start
```

The server runs from `page.js` (see `package.json` → `scripts.start`).

## Project layout

- `page.js` — Express app, routes, Mongoose models
- `views/` — EJS templates
- `public/` — static assets (CSS, etc.)

## Security note

Do not commit `.env` or real credentials. The repository includes `.env.example` only.
