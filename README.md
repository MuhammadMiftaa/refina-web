# Aurify — Frontend

> Premium financial management SaaS — budgeting, tracking, invoicing & reporting.

## Tech Stack

- **React 19** + **TypeScript**
- **React Router v7**
- **Tailwind CSS v4** (Vite plugin)
- **Vite** + **PWA** (vite-plugin-pwa)
- **Playwright** for E2E testing

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run E2E tests
npm run test
```

## Environment Variables

| Variable       | Description           | Default                 |
| -------------- | --------------------- | ----------------------- |
| `VITE_API_URL` | Auth backend base URL | `http://localhost:8080` |

For production, configure `public/env.js` via `envsubst` at container startup using `public/env.template.js`.

## Project Structure

```
src/
├── components/
│   ├── layout/       # AuthLayout, etc.
│   └── ui/           # Reusable form elements
├── contexts/         # AuthContext, ThemeContext
├── lib/              # API client, utilities, constants
├── pages/            # Auth pages (Login, Register, OTP, etc.)
└── types/            # TypeScript interfaces
```
