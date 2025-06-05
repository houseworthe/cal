import csv
import os
from datetime import datetime

def get_logs_path():
    return "data/logs.csv"

def save_log_entry(data: dict):
    logs_path = get_logs_path()
    
    os.makedirs(os.path.dirname(logs_path), exist_ok=True)
    
    fieldnames = [
        "date", "breakfast_description", "lunch_description", 
        "dinner_description", "snack_description", "mood", 
        "hydration", "sleep", "activity", "notes", "timestamp"
    ]
    
    data["timestamp"] = datetime.now().isoformat()
    
    file_exists = os.path.exists(logs_path)
    
    with open(logs_path, "a", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        if not file_exists:
            writer.writeheader()
        
        row = {field: data.get(field, "") for field in fieldnames}
        writer.writerow(row)