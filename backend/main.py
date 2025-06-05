from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.log import router as log_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Cal - Nutrition & Wellness Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(log_router)

@app.get("/")
async def root():
    return {"message": "Cal API is running"}