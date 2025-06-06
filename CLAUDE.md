# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cal is a local-first nutrition and wellness tracker that uses Claude 3.5 Sonnet to convert natural language meal/mood logs into structured JSON data stored in CSV format.

## Development Setup

### Backend Setup

- `prompt_template.txt` contains the base Claude prompt with placeholders
- `prompt_schema.json` defines the expected JSON structure
- The backend injects the schema and user input into the template before making the API call

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

⚠️ Claude doesn't need to return only a json structure, but we need to pull it out and load it into the csv.  
If a field is not mentioned by the user, omit it entirely.  
Do not include any explanations, comments, or markdown formatting.


## Current Project Status

The project appears to be in early setup phase. The `cal-backend` and `cal-web` directories are currently empty. The backend implementation described in the README needs to be created.