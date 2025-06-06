import os
import json
from anthropic import Anthropic
from datetime import datetime, timedelta

async def process_user_input(user_input: str) -> tuple[dict, bool]:
    """
    Process user input with Claude and return (structured_data, is_meaningful).
    is_meaningful indicates if the data contains wellness information worth logging.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
    
    client = Anthropic(api_key=api_key)
    
    with open("prompt_template.txt", "r") as f:
        prompt_template = f.read()
    
    with open("prompt_schema.json", "r") as f:
        schema = json.load(f)
    
    prompt = prompt_template.replace("{USER_INPUT}", user_input)
    prompt = prompt.replace("{JSON_SCHEMA}", json.dumps(schema, indent=2))
    
    # Provide current date, yesterday, and timestamp for Claude to use
    current_date = datetime.now()
    yesterday_date = current_date - timedelta(days=1)
    prompt = prompt.replace("{CURRENT_DATE}", current_date.strftime("%Y-%m-%d"))
    prompt = prompt.replace("{YESTERDAY_DATE}", yesterday_date.strftime("%Y-%m-%d"))
    prompt = prompt.replace("{CURRENT_TIMESTAMP}", current_date.isoformat())
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        temperature=0,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    try:
        result = json.loads(response.content[0].text)
        
        # Ensure required fields exist
        if "date" not in result:
            result["date"] = current_date.strftime("%Y-%m-%d")
        if "timestamp" not in result:
            result["timestamp"] = current_date.isoformat()
        
        # Extract fields for backward compatibility and meaningful check
        fields = result.get("fields", {})
        
        # Check if the result contains meaningful wellness data
        meaningful_fields = [
            "breakfast_description", "lunch_description", "dinner_description", 
            "snack_description", "hydration", "sleep", "activity", "alcohol",
            "caffeine", "marijuana", "exercise_type", "supplements"
        ]
        
        # Check mood subfields
        mood_data = fields.get("mood", {})
        has_mood = any(mood_data.get(time) for time in ["morning", "afternoon", "night"])
        
        is_meaningful = has_mood or any(
            fields.get(field) and str(fields.get(field)).strip() and 
            str(fields.get(field)).strip() not in ["-", "n/a", "none", "null"]
            for field in meaningful_fields
        )
        
        # Flatten the structure for backward compatibility with existing code
        flattened_result = {
            "date": result["date"],
            "timestamp": result["timestamp"]
        }
        
        # Add all fields from the nested structure to the flat structure
        for key, value in fields.items():
            if key == "mood" and isinstance(value, dict):
                # Split mood into separate time-based fields
                flattened_result["mood_morning"] = value.get("morning", "")
                flattened_result["mood_afternoon"] = value.get("afternoon", "")
                flattened_result["mood_night"] = value.get("night", "")
            elif key == "supplements" and isinstance(value, list):
                # Store supplements as JSON string
                flattened_result["supplements"] = json.dumps(value) if value else "[]"
            else:
                flattened_result[key] = value
        
        return flattened_result, is_meaningful
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Claude's response as JSON")