import csv
import json
import os
from datetime import datetime
from typing import Dict, Optional

def get_daily_logs_path():
    return "data/daily_logs.csv"

def read_daily_logs() -> Dict[str, Dict]:
    """Read existing daily logs and return as dict keyed by date"""
    logs_path = get_daily_logs_path()
    daily_logs = {}
    
    if not os.path.exists(logs_path):
        return daily_logs
    
    try:
        with open(logs_path, "r", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                date = row.get("date")
                if date:
                    daily_logs[date] = row
    except Exception as e:
        print(f"Error reading daily logs: {e}")
    
    return daily_logs

def save_daily_logs(daily_logs: Dict[str, Dict]):
    """Save daily logs dict back to CSV"""
    logs_path = get_daily_logs_path()
    
    os.makedirs(os.path.dirname(logs_path), exist_ok=True)
    
    fieldnames = [
        "date", "breakfast_description", "lunch_description", 
        "dinner_description", "snack_description", "mood_morning", "mood_afternoon", "mood_night",
        "hydration", "sleep", "activity", "notes", "alcohol",
        "caffeine", "marijuana", "exercise_type", "supplements", "last_updated"
    ]
    
    with open(logs_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        # Sort by date for consistent output
        for date in sorted(daily_logs.keys()):
            row = daily_logs[date]
            # Ensure all fields exist
            complete_row = {field: row.get(field, "") for field in fieldnames}
            writer.writerow(complete_row)

def should_append_field(field: str) -> bool:
    """Determine if a field should append new values or overwrite"""
    # Fields that should append (accumulative throughout the day)
    append_fields = [
        "breakfast_description", "lunch_description", "dinner_description", 
        "snack_description", "hydration", "activity", "notes"
    ]
    
    # Fields that should overwrite (latest value takes precedence)
    overwrite_fields = ["sleep", "mood_morning", "mood_afternoon", "mood_night", "alcohol", "caffeine", "marijuana", "exercise_type"]
    
    return field in append_fields

def merge_field_value(existing_value: str, new_value: str, field: str) -> str:
    """Smart merge of field values based on field type"""
    if not existing_value or not existing_value.strip():
        return new_value
    
    if not new_value or not new_value.strip():
        return existing_value
    
    # Clean up values
    existing_clean = existing_value.strip()
    new_clean = new_value.strip()
    
    # For overwrite fields (sleep, mood), always use the new value
    if not should_append_field(field):
        return new_clean
    
    # For append fields, check for duplicates more intelligently
    existing_lower = existing_clean.lower()
    new_lower = new_clean.lower()
    
    # Check if the new value is already contained in existing (avoid duplicates)
    if new_lower in existing_lower:
        return existing_clean  # Keep existing since it already contains the new value
    
    if existing_lower in new_lower:
        return new_clean  # New value is more detailed, use it
    
    # Check if they're similar items (for snacks/drinks)
    # Split existing values by commas to check individual items
    existing_items = [item.strip().lower() for item in existing_clean.split(',')]
    
    # If the new value is very similar to any existing item, don't add it
    for existing_item in existing_items:
        if (len(new_lower) > 3 and new_lower in existing_item) or \
           (len(existing_item) > 3 and existing_item in new_lower):
            # Similar items found, keep the longer/more detailed one
            if len(new_clean) > len(existing_item):
                # Replace the existing item with the new one
                existing_items_original = [item.strip() for item in existing_clean.split(',')]
                for i, orig_item in enumerate(existing_items_original):
                    if orig_item.lower() == existing_item:
                        existing_items_original[i] = new_clean
                        return ', '.join(existing_items_original)
            return existing_clean
    
    # No duplicates found, append the new value
    return f"{existing_clean}, {new_clean}"

def merge_daily_entry(parsed_data: Dict, target_date: Optional[str] = None) -> bool:
    """
    Merge parsed data into daily logs for the specified date with smart field merging.
    Returns True if data was merged, False if skipped due to ambiguity.
    """
    if target_date is None:
        # Use the date from parsed data if available, otherwise use today
        target_date = parsed_data.get("date", datetime.now().strftime("%Y-%m-%d"))
    
    # Check if parsed data contains meaningful wellness information
    meaningful_fields = [
        "breakfast_description", "lunch_description", "dinner_description", 
        "snack_description", "mood_morning", "mood_afternoon", "mood_night", 
        "hydration", "sleep", "activity", "notes",
        "alcohol", "caffeine", "marijuana", "exercise_type", "supplements"
    ]
    
    has_meaningful_data = any(
        parsed_data.get(field) and str(parsed_data.get(field)).strip() 
        for field in meaningful_fields
    )
    
    if not has_meaningful_data:
        print(f"Skipping daily log update - no meaningful wellness data found")
        return False
    
    # Read existing daily logs
    daily_logs = read_daily_logs()
    
    # Get existing entry for this date or create new one
    existing_entry = daily_logs.get(target_date, {"date": target_date})
    
    # Merge new data into existing entry with smart field merging
    updated_entry = existing_entry.copy()
    updated_entry["last_updated"] = datetime.now().isoformat()
    
    for field, value in parsed_data.items():
        if field == "date":
            continue  # Don't overwrite the date key
        
        if value is not None:  # Process all non-None values (including False, 0, [])
            existing_value = existing_entry.get(field, "")
            
            # Special handling for different field types
            if field == "supplements" and isinstance(value, list):
                # Merge supplement arrays
                existing_supplements = []
                if existing_value:
                    try:
                        existing_supplements = json.loads(existing_value) if existing_value.startswith('[') else existing_value.split(', ')
                    except:
                        existing_supplements = existing_value.split(', ') if existing_value else []
                
                # Combine and deduplicate
                combined_supplements = list(set(existing_supplements + value))
                merged_value = json.dumps(combined_supplements) if combined_supplements else ""
            else:
                merged_value = merge_field_value(existing_value, str(value), field)
            
            updated_entry[field] = merged_value
            
            print(f"Field '{field}': '{existing_value}' + '{value}' = '{merged_value}'")
    
    # Update the daily logs dict
    daily_logs[target_date] = updated_entry
    
    # Save back to CSV
    save_daily_logs(daily_logs)
    
    print(f"Updated daily log for {target_date}")
    return True

def get_daily_logs_for_api() -> list:
    """Get daily logs formatted for API response"""
    daily_logs = read_daily_logs()
    
    # Convert dict to list format expected by frontend
    logs_list = []
    for date, log_data in daily_logs.items():
        logs_list.append(log_data)
    
    return logs_list