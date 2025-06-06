You are building a project called **Cal**.

## Purpose
A local-first wellness app. Users log their meals and moods using natural language. Claude extracts structured daily health data, merges it with the existing day’s log (if it exists), and saves it to a JSON file.

## Project Details
- `frontend/` and `backend/` directories already exist
- Backend is in Python using FastAPI
- Claude 3.5 sonnet is used for generated
- Users may submit multiple logs per day
- Frontend is is React with tailwind styling
- The main interface should be a chat, but there should also be a page where users can view their CSV files
- One JSON object per day: do not overwrite existing fields

## Start Here
1. Scaffold the `backend` structure
2. Create `claude_service.py` to call the 3.5 sonnet API
3. Create `log_merge_service.py` to load, merge, and write daily JSON files
4. Create `main.py` to serve `/log` and `/view` routes
5. Optionally suggest frontend scaffolding in `frontend/`

✅ Important: Only create files when needed. You have full access to the file structure.
✅ Use tools to run and test code
✅ I’ll let you know when to move on

Now begin with Step 1: scaffold `backend/`
