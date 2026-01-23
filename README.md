# ScraperForm

A simple React + Vite + Tailwind app to scrape business data via webhooks and display them in a table.

## Authentication

This app is gated behind a minimal, single-user login with no database. The credentials are hardcoded as requested.

- Email: mahamitrads@gmail.com
- Password: Jaihanuman5@Sriram

After successful login, the session is remembered using localStorage. Use the Logout button in the header to end the session.

## Development

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 and log in to access the app.

## Build

```bash
npm run build
```

```bash
npm run preview
```
