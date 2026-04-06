# Instagram Comment-to-DM Automation

Full-stack Instagram engagement automation for your GitHub repo, modeled after the reference project you shared.

This repo is now organized as:

- `backend/`: FastAPI service for webhook verification, comment event handling, reel/post config, and Instagram Graph API calls
- `frontend/`: Next.js dashboard for viewing media and editing automation rules

## Features

- Keyword-triggered DM automation for Instagram comments
- Public comment reply automation
- Per-reel or per-post configuration stored in JSON
- Lightweight admin dashboard
- Ready for Railway + Vercel style deployment

## Project structure

```text
backend/
  routers/
  services/
frontend/
  app/
```

## Local setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## Required environment variables

### Backend

- `VERIFY_TOKEN`
- `INSTAGRAM_ACCESS_TOKEN`
- `IG_BUSINESS_ACCOUNT_ID`
- `GRAPH_API_VERSION` (optional, defaults to `v20.0`)
- `CONFIG_FILE` (optional, defaults to `reels_config.json`)

### Frontend

- `NEXT_PUBLIC_API_URL`

## Deploy

- Deploy `backend/` to Railway or any Python host
- Deploy `frontend/` to Vercel
- Point your Meta webhook callback to `/webhook`

## Notes

- Existing legacy files from the old workspace scaffold were left untouched unless they conflicted with the new project metadata.
- The new app follows the same overall pattern as the reference repo, with a few small cleanup improvements around configuration handling and error responses.
