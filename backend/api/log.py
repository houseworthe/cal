from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from services.claude_service import process_user_input
from services.raw_logger import save_raw_message
from services.daily_logs_manager import merge_daily_entry, get_daily_logs_for_api
import os

router = APIRouter()

class LogInput(BaseModel):
    input: str

@router.post("/log")
async def log_entry(log_input: LogInput):
    try:
        # Always save the raw message to logs.csv
        raw_message_saved = save_raw_message(log_input.input)
        if not raw_message_saved:
            raise HTTPException(status_code=400, detail="Invalid or empty message")
        
        # Process with Claude to get structured data
        structured_data, is_meaningful = await process_user_input(log_input.input)
        
        # Only update daily logs if the message contains meaningful wellness data
        daily_log_updated = False
        if is_meaningful:
            daily_log_updated = merge_daily_entry(structured_data)
        
        return {
            "status": "success", 
            "data": structured_data,
            "daily_log_updated": daily_log_updated,
            "raw_message_saved": raw_message_saved
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/view")
async def view_logs(format: str = "download"):
    from services.daily_logs_manager import get_daily_logs_path
    
    daily_logs_path = get_daily_logs_path()
    
    if not os.path.exists(daily_logs_path):
        return JSONResponse(content={"message": "No logs found"}, status_code=404)
    
    if format == "download":
        return FileResponse(
            path=daily_logs_path,
            media_type="text/csv",
            filename="daily_wellness_logs.csv"
        )
    else:
        logs = get_daily_logs_for_api()
        return {"logs": logs}

@router.get("/view/raw")
async def view_raw_logs(format: str = "download"):
    """Endpoint to view raw message logs"""
    from services.raw_logger import get_raw_logs_path
    
    raw_logs_path = get_raw_logs_path()
    
    if not os.path.exists(raw_logs_path):
        return JSONResponse(content={"message": "No raw logs found"}, status_code=404)
    
    if format == "download":
        return FileResponse(
            path=raw_logs_path,
            media_type="text/csv",
            filename="raw_messages.csv"
        )
    else:
        import csv
        with open(raw_logs_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            logs = list(reader)
        return {"logs": logs}

@router.get("/recent")
async def get_recent_activity():
    """Get recent raw messages and today's aggregated data for the UI"""
    import csv
    from datetime import datetime, timedelta
    from services.raw_logger import get_raw_logs_path
    from services.daily_logs_manager import get_daily_logs_for_api
    
    # Get recent raw messages (last 10)
    recent_messages = []
    raw_logs_path = get_raw_logs_path()
    
    if os.path.exists(raw_logs_path):
        try:
            with open(raw_logs_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                all_messages = []
                
                for row in reader:
                    # Validate each row has required fields and valid data
                    if (row.get("timestamp") and row.get("message") and 
                        row["message"].strip() and row["timestamp"].strip()):
                        all_messages.append(row)
                
                recent_messages = all_messages[-10:] if all_messages else []
        except Exception as e:
            print(f"Error reading raw logs: {e}")
    
    # Get today's aggregated data
    today = datetime.now().strftime("%Y-%m-%d")
    daily_logs = get_daily_logs_for_api()
    today_log = next((log for log in daily_logs if log.get("date") == today), None)
    
    # Calculate activity streak
    def calculate_streak(logs):
        if not logs:
            return 0
        
        # Sort logs by date in descending order
        sorted_logs = sorted(logs, key=lambda x: x.get("date", ""), reverse=True)
        
        streak = 0
        current_date = datetime.now().date()
        
        for log in sorted_logs:
            log_date_str = log.get("date")
            if not log_date_str:
                continue
                
            try:
                log_date = datetime.strptime(log_date_str, "%Y-%m-%d").date()
                
                # If this is today or the expected previous day, count it
                if log_date == current_date or (streak > 0 and log_date == current_date - timedelta(days=1)):
                    streak += 1
                    current_date = log_date
                else:
                    # Streak is broken
                    break
            except ValueError:
                continue
        
        return streak
    
    activity_streak = calculate_streak(daily_logs)
    
    return {
        "recent_messages": recent_messages,
        "today_log": today_log,
        "daily_logs": daily_logs,
        "activity_streak": activity_streak
    }