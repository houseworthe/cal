# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cal is a local-first nutrition and wellness tracker that uses Claude 4 Opus to convert natural language meal/mood logs into structured JSON data stored in CSV format.

## Development Setup

### Backend Setup
According to the README, the backend structure should be:
```
backend/
├── main.py                 # FastAPI entrypoint
├── api/log.py             # Route for logging user input
├── services/
│   ├── claude_service.py  # Handles Claude API call and prompt
│   └── log_writer.py      # Saves structured data to CSV
├── data/logs.csv          # Local meal/mood logs
├── prompt_template.txt    # Prompt used for Claude structuring
├── .env                   # Claude API key
└── requirements.txt       # Python dependencies
```

### Environment Setup
1. Create `.env` file in `/backend` with: `ANTHROPIC_API_KEY=your-api-key-here`
2. Install dependencies: `cd backend && uv pip install -r requirements.txt`
3. Run server: `./run.sh` (from project root)

### Alternative Docker Setup
`docker-compose up --build`

## Key API Endpoints

- `POST /log` - Submit natural language input for processing
- `GET /view` - Download or preview logged data

## Data Structure

The Claude prompt expects these JSON fields:
- `date`
- `breakfast_description`
- `lunch_description`
- `dinner_description`
- `snack_description`
- `mood`
- `hydration`
- `sleep`
- `activity`
- `notes`

## Current Project Status

The project appears to be in early setup phase. The `cal-backend` and `cal-web` directories are currently empty. The backend implementation described in the README needs to be created.