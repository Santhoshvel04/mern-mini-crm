# Mini CRM (MERN Interview Assignment)

| Folder | Role |
|---|---|
| `mini-crm-frontend` | React SPA (Vite, React Router, MUI, Axios, TanStack Query) |
| `mini-crm-service` | Express API (MongoDB + Mongoose, JWT access token, bcrypt) |

## Authorization (required by the assignment)

- Login issues a **JWT access token**. Password is stored with **bcrypt** only.
- Protected APIs require `Authorization: Bearer <token>`. Missing/invalid token → `401`.
- Soft-deleted leads (`isDeleted: true`) are excluded from list, search, filter, company associated leads, and dashboard counts.
- **Task status** may be updated only by the user assigned to that task → otherwise `403`.

## Local run

1. MongoDB running locally (or set `MONGODB_URI`).
2. Backend:

```bash
cd mini-crm-service
copy .env.example .env
npm install
npm run seed
npm run dev
```

3. Frontend:

```bash
cd mini-crm-frontend
copy .env.example .env
npm install
npm run dev
```

Seed login: `john@mini-crm.com` / `Password123`

## API prefix

All JSON APIs live under `/api/v1`.
