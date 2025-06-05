import os
import json
from anthropic import Anthropic
from datetime import datetime

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
    prompt = prompt.replace("{CURRENT_DATE}", datetime.now().strftime("%Y-%m-%d"))
    
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
        if "date" not in result:
            result["date"] = datetime.now().strftime("%Y-%m-%d")
        
        # Check if the result contains meaningful wellness data
        meaningful_fields = [
            "breakfast_description", "lunch_description", "dinner_description", 
            "snack_description", "mood", "hydration", "sleep", "activity"
        ]
        
        is_meaningful = any(
            result.get(field) and str(result.get(field)).strip() and 
            str(result.get(field)).strip() not in ["-", "n/a", "none", "null"]
            for field in meaningful_fields
        )
        
        return result, is_meaningful
    except json.JSONDecodeError:
        raise ValueError("Failed to parse Claude's response as JSON")