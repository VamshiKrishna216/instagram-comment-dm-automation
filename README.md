# Instagram Comment-to-DM Automation

A full-stack automation platform that connects Instagram comment events to configurable public replies and direct-message workflows.

## Architecture

```text
                    Instagram
                        │
                     Webhook
                        │
                        ▼
              ┌──────────────────┐
              │  FastAPI Backend  │
              │                  │
              │ webhook + rules  │
              │ Graph API client │
              └────────┬─────────┘
                       │ REST
                       ▼
              ┌──────────────────┐
              │  Next.js Dashboard│
              │ media + automation│
              │ configuration     │
              └──────────────────┘
```

## Features

- Keyword-triggered comment-to-DM workflows
- Public comment reply automation
- Per-post / per-reel automation configuration
- Instagram Graph API integration
- Webhook verification and event handling
- Next.js administration dashboard
- FastAPI backend
- Environment-based configuration

## Stack

**Frontend:** Next.js 14, React, TypeScript, Tailwind CSS

**Backend:** Python, FastAPI, Uvicorn, Requests

**Integration:** Instagram Graph API, webhooks

## Project structure

```text
backend/
├── routers/
├── services/
└── main.py

frontend/
└── app/

.env.example
reels_config.json
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
npm run dev
```

### Environment

Configure the required values in the environment files. **Never commit real access tokens or secrets.**

## Deployment

The application can be split into independently deployed frontend and backend services, for example:

- Frontend → Vercel or another Next.js host
- Backend → Railway or another Python host

## Engineering focus

This project demonstrates event-driven API integration, backend/frontend separation, external API authentication, configuration management, and automation workflows.

## Roadmap

- Database-backed configuration
- Authentication and role-based access
- Queue-based event processing
- Retry and rate-limit handling
- Automated tests
- Observability and structured logging
