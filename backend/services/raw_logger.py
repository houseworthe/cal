import csv
import os
from datetime import datetime

def get_raw_logs_path():
    return "data/logs.csv"

def save_raw_message(message: str):
    """Save raw user message to logs.csv with timestamp"""
    # Validate message content
    if not message or not isinstance(message, str):
        print(f"Warning: Invalid message attempted to be saved: {repr(message)}")
        return False
    
    # Clean and validate message
    cleaned_message = message.strip()
    if not cleaned_message:
        print("Warning: Empty message attempted to be saved")
        return False
    
    logs_path = get_raw_logs_path()
    
    os.makedirs(os.path.dirname(logs_path), exist_ok=True)
    
    fieldnames = ["timestamp", "message"]
    
    # Generate ISO 8601 timestamp in local time
    try:
        timestamp = datetime.now().isoformat()
    except Exception as e:
        print(f"Error generating timestamp: {e}")
        timestamp = datetime.now().isoformat()  # Fallback
    
    file_exists = os.path.exists(logs_path)
    
    try:
        with open(logs_path, "a", newline="", encoding="utf-8") as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            if not file_exists:
                writer.writeheader()
            
            writer.writerow({
                "timestamp": timestamp,
                "message": cleaned_message
            })
        
        return True
    except Exception as e:
        print(f"Error saving raw message: {e}")
        return False