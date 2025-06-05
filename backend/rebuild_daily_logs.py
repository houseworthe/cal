#!/usr/bin/env python3
"""Script to rebuild daily logs from raw messages using the new merging logic"""

import csv
import os
import sys
from datetime import datetime
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.raw_logger import get_raw_logs_path
from services.daily_logs_manager import merge_daily_entry, save_daily_logs
from services.claude_service import process_user_input
import asyncio

async def rebuild_daily_logs():
    """Rebuild daily logs from raw messages with new merging logic"""
    print("Rebuilding daily logs from raw messages...")
    
    # Clear existing daily logs
    daily_logs_path = "data/daily_logs.csv"
    if os.path.exists(daily_logs_path):
        os.remove(daily_logs_path)
        print("Cleared existing daily logs")
    
    # Read raw messages
    raw_logs_path = get_raw_logs_path()
    if not os.path.exists(raw_logs_path):
        print("No raw logs found")
        return
    
    processed_count = 0
    
    try:
        with open(raw_logs_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                timestamp = row.get("timestamp", "")
                message = row.get("message", "")
                
                if not message or not message.strip():
                    continue
                
                try:
                    # Get date from timestamp
                    if timestamp:
                        dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                        date = dt.strftime("%Y-%m-%d")
                    else:
                        date = datetime.now().strftime("%Y-%m-%d")
                    
                    print(f"\nProcessing: '{message}' for {date}")
                    
                    # Process message with Claude
                    structured_data, is_meaningful = await process_user_input(message)
                    
                    if is_meaningful:
                        # Merge into daily logs
                        success = merge_daily_entry(structured_data, date)
                        if success:
                            processed_count += 1
                            print(f"✅ Merged successfully")
                        else:
                            print(f"❌ Failed to merge")
                    else:
                        print(f"⏭️  Skipped - no meaningful wellness data")
                        
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
                    continue
    
    except Exception as e:
        print(f"Error reading raw logs: {e}")
        return
    
    print(f"\n✅ Rebuild complete! Processed {processed_count} meaningful messages.")
    print("Check data/daily_logs.csv for the rebuilt logs.")

if __name__ == "__main__":
    asyncio.run(rebuild_daily_logs())