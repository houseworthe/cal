#!/usr/bin/env python3
"""
Migration script to convert existing daily logs to the new schema format.
This adds the new fields and ensures backward compatibility.
"""

import csv
import json
import os
from datetime import datetime

def migrate_daily_logs():
    """Migrate existing daily_logs.csv to include new fields"""
    
    daily_logs_path = "data/daily_logs.csv"
    backup_path = "data/daily_logs_backup.csv"
    
    if not os.path.exists(daily_logs_path):
        print("No daily_logs.csv found, nothing to migrate")
        return
    
    # Create backup
    if os.path.exists(daily_logs_path):
        os.rename(daily_logs_path, backup_path)
        print(f"Created backup at {backup_path}")
    
    # Read old data
    old_data = []
    with open(backup_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        old_data = list(reader)
    
    # New field names with expanded schema
    new_fieldnames = [
        "date", "breakfast_description", "lunch_description", 
        "dinner_description", "snack_description", "mood", 
        "hydration", "sleep", "activity", "notes", "alcohol",
        "caffeine", "marijuana", "exercise_type", "supplements", "last_updated"
    ]
    
    # Write migrated data
    with open(daily_logs_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=new_fieldnames)
        writer.writeheader()
        
        for old_row in old_data:
            # Start with old data
            new_row = {field: old_row.get(field, "") for field in new_fieldnames}
            
            # Set default values for new fields
            if not new_row.get("alcohol"):
                new_row["alcohol"] = ""
            if not new_row.get("caffeine"):
                new_row["caffeine"] = ""
            if not new_row.get("marijuana"):
                new_row["marijuana"] = ""
            if not new_row.get("exercise_type"):
                new_row["exercise_type"] = ""
            if not new_row.get("supplements"):
                new_row["supplements"] = ""
            
            # Update last_updated if missing
            if not new_row.get("last_updated"):
                new_row["last_updated"] = datetime.now().isoformat()
            
            writer.writerow(new_row)
    
    print(f"Migration complete! Updated {len(old_data)} entries")
    print("New fields added: alcohol, caffeine, marijuana, exercise_type, supplements")

def analyze_missing_sleep():
    """Check why the recent sleep entry might not have been processed"""
    
    # Look at recent raw logs
    raw_logs_path = "data/logs.csv"
    if os.path.exists(raw_logs_path):
        print("\nAnalyzing recent raw logs:")
        with open(raw_logs_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            logs = list(reader)
            
            # Show last 3 entries
            for log in logs[-3:]:
                timestamp = log.get('timestamp', 'No timestamp')
                message = log.get('message', 'No message')
                print(f"  {timestamp}: {message}")

if __name__ == "__main__":
    print("🔄 Starting data migration...")
    migrate_daily_logs()
    analyze_missing_sleep()
    print("✅ Migration complete!")