# NGO Platform

A full-stack web platform for a non-profit organisation: manage **community services**, **volunteers**, **donations**, **partnerships**, **staff interest**, **budget visibility**, and a living **FAQ**—all backed by **MongoDB** and secured with **login and admin roles**.

Whether you are pitching the project, onboarding a teammate, or revisiting it months later, this README is the map.

---

## Why this project exists

Traditional spreadsheets and email threads do not scale when an NGO runs multiple initiatives, tracks donors, and coordinates volunteers. This app puts those flows into one place: a single **Node.js** server, **EJS** pages, and **Mongoose** models so data stays structured and queryable (including **full-text search** on services).

---

## What you can do (features)

### For everyone (including guests)

| Area | What happens |
|------|----------------|
| **Home** | Landing experience after visiting `/` (redirects to `/home`). |
| **Contact** | Reach-out page at `/contact`. |
| **Budget** | View budget-related information at `/budget`. |
| **Donate** | Submit donor details and contribution preferences at `/don` (stored as **Donator** records). |
| **Careers / interest** | Employees can express interest via `/emp` (**Employee** records). |
| **FAQs** | Browse all questions at `/faq`; open a thread at `/faq/:id` and add answers. |

### For registered users (after login)

| Area | What happens |
|------|----------------|
| **Volunteering** | Register volunteer profiles at `/vol` and follow the thank-you flow. |
| **Member hub** | Logged-in users are steered to `/join` for member-oriented content. |
| **Partnerships** | Organisations can propose collaborations at `/col` (**Colloboration** collection). |
| **Services** | List all NGO services at `/services`; open detail pages at `/services/:id`. |
| **Service search** | POST to search services using MongoDB **text index** on service names (`/searchservices` from the services UI). |

### For administrators

| Capability | Detail |
|------------|--------|
| **Role** | Users whose username matches `ADMIN` in `.env` are promoted to **`admin`** on registration. |
| **Add services** | `/addservice` — only admins; others see a denial message. |
| **Post-login routing** | Admins land on `/home` after login; restricted users go to `/join`. |

### Authentication & sessions

- **Passport.js** with **passport-local-mongoose** (username + password, hashed in MongoDB).
- **express-session** for persistent login state.
- **Protected routes** use an `isLoggedIn` guard (unauthenticated users are sent to `/login`).

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| HTTP / routing | Express |
| Views | EJS |
| Database | MongoDB |
| ODM | Mongoose |
| Auth | Passport, passport-local, passport-local-mongoose |
| Config | dotenv (e.g. `ADMIN` username for role promotion) |
| Parser | body-parser (URL-encoded forms) |

---

## Data model (MongoDB collections)

Roughly what gets stored (see `page.js` for exact schemas):

- **User** — accounts with `restricted` vs `admin` roles (plus profile fields).
- **Service** — name, location, date, description, amount, linked volunteers; **text index** on service name for search.
- **Volunteer** — volunteer applications (name, contact, DOB, location).
- **Donator** — donor submissions (contact, location, preference, amount).
- **Employee** — job / role interest submissions.
- **Colloboration** — partnership proposals from other organisations.
- **Budget** — budget line concepts (name, expenditure, income, balance).
- **faq** — questions with an array of **answers** (threaded-style FAQ).

This structure maps cleanly to a **DBMS / database design** narrative: entities, relationships (e.g. services ↔ volunteers), and queries (including text search).

---

## Project layout

```
├── page.js              # Express app: models, routes, auth, server (port 3000)
├── package.json         # Dependencies and npm scripts
├── package-lock.json    # Locked dependency tree
├── .env.example         # Template for local environment variables
├── public/              # Static assets (CSS, etc.)
└── views/               # EJS templates (pages + partials)
```

---

## Prerequisites

- **[Node.js](https://nodejs.org/)** (LTS recommended)
- **[MongoDB](https://www.mongodb.com/)** running locally  
  Default connection string in code: `mongodb://localhost/ngo_app`

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment file

**Windows (Command Prompt or PowerShell):**

```bash
copy .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Edit `.env` and set:

- **`ADMIN`** — the **exact username** that should become an **admin** when that account registers (must match the username chosen at sign-up).

### 3. Start MongoDB

Ensure `mongod` (or your MongoDB service) is running so `ngo_app` can be created on first use.

### 4. Run the app

```bash
npm start
```

This runs `node page.js`. The server listens on **port 3000**.

Open **[http://localhost:3000](http://localhost:3000)** — you will be redirected to `/home`.

### 5. First-time flow (suggested)

1. Visit `/register` and create an account.  
   If the username matches `ADMIN` in `.env`, that user becomes **admin**.
2. Log in at `/login`.
3. As admin, explore `/addservice` and `/services`.
4. Try `/faq`, `/don`, `/vol`, and `/col` to populate demo data for presentations.

---

## Useful routes (cheat sheet)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/` | Redirects to `/home` |
| GET | `/home` | Home |
| GET/POST | `/login`, `/register`, `/logout` | Auth |
| GET | `/services`, `/services/:id` | List + detail (detail may be reachable without login depending on route) |
| GET | `/addservice` | Admin-only |
| GET | `/faq`, `/faq/:id` | FAQ list + thread |
| POST | `/services`, `/vol`, `/col`, `/emp`, `/don`, `/addfaq`, `/addans`, `/searchservices` | Form submissions & search |

*(Exact access rules are implemented in `page.js`—some GETs use `isLoggedIn`.)*

---

## Security & production notes

- **Do not commit `.env`** — it is gitignored; only `.env.example` belongs in the repo.
- Session **secret** and **MongoDB URI** are currently fixed in code; for a real deployment, move them to environment variables and use a strong, random session secret.
- This project fits **academic / demo** use; run a dependency audit (`npm audit`) before any public deployment.

---

## Contributing / coursework

If this is a team assignment, agree on:

- Branch naming and PR reviews  
- Who owns the MongoDB backup or seed data  
- A short **demo script** (register → login → add service → search → FAQ)

---

## License

Use and attribution per your institution’s coursework policy.

---

**Built with:** Express · EJS · MongoDB · Passport · Mongoose  

*Questions or improvements? Extend the FAQ in-app—or extend this README.*
