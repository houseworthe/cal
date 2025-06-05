"""Utility to validate and fix logs.csv format"""

import csv
import os
from datetime import datetime, timezone
from typing import List, Dict

def validate_logs_csv() -> bool:
    """Check if logs.csv has valid format and timestamps"""
    logs_path = "data/logs.csv"
    
    if not os.path.exists(logs_path):
        return True  # No file is valid (will be created on first write)
    
    try:
        with open(logs_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            
            # Check header
            if reader.fieldnames != ["timestamp", "message"]:
                print("Invalid header in logs.csv")
                return False
            
            # Check each row
            for row in reader:
                # Validate timestamp
                ts = row.get("timestamp", "")
                if not ts:
                    print("Missing timestamp found")
                    return False
                    
                try:
                    dt = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    # Check if timezone aware
                    if dt.tzinfo is None:
                        print(f"Timestamp without timezone: {ts}")
                        return False
                except:
                    print(f"Invalid timestamp format: {ts}")
                    return False
                
                # Validate message
                msg = row.get("message", "")
                if not msg or not msg.strip():
                    print("Empty message found")
                    return False
        
        return True
        
    except Exception as e:
        print(f"Error validating logs.csv: {e}")
        return False

def regenerate_logs_csv(entries: List[Dict[str, str]] = None):
    """Regenerate logs.csv with proper format"""
    logs_path = "data/logs.csv"
    
    # If no entries provided, try to read and fix existing file
    if entries is None:
        entries = []
        if os.path.exists(logs_path):
            try:
                with open(logs_path, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        if row.get("message") and row["message"].strip():
                            entries.append({
                                "timestamp": row.get("timestamp", ""),
                                "message": row["message"].strip()
                            })
            except:
                pass
    
    # Fix timestamps in all entries
    fixed_entries = []
    for entry in entries:
        timestamp = entry.get("timestamp", "")
        
        # Parse and fix timestamp
        try:
            if timestamp:
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
                timestamp = dt.isoformat()
            else:
                timestamp = datetime.now(timezone.utc).isoformat()
        except:
            timestamp = datetime.now(timezone.utc).isoformat()
        
        fixed_entries.append({
            "timestamp": timestamp,
            "message": entry["message"]
        })
    
    # Write clean file
    os.makedirs(os.path.dirname(logs_path), exist_ok=True)
    
    with open(logs_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["timestamp", "message"])
        writer.writeheader()
        writer.writerows(fixed_entries)
    
    print(f"Regenerated logs.csv with {len(fixed_entries)} entries")