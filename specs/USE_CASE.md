# 🧪 Cal – Daily Use Case with Merging Behavior

This document walks through a real user interaction with **Cal**, using a per-day data structure that gets updated with each new input. Claude is instructed to append new info without altering or removing existing data.

---

## 🗓️ Concept: One JSON Document Per Day

- Each day is tracked by a **single structured JSON object**
- When a user logs a new message, Claude receives:
  1. The **current day's existing JSON**
  2. The **new natural language input**
  3. A strict instruction:  
     ⚠️ "DO NOT change or overwrite existing data. Only fill in missing fields or add to notes." ⚠️

---

## 1. 👤 User's First Log

```
Woke up around 9 and had a protein bar. Feeling a little tired. Didn't sleep great.
```

---

## 2. 🔄 Existing Daily JSON (Empty on First Log)

```json
{
  "date": "2025-06-05"
}
```

---

## 3. 🔁 Claude Receives Prompt:

```txt
You are a structured data assistant.

Below is the current JSON dataset for today.  
DO NOT remove or change any fields that already have values.  
Only fill in empty fields or add new details to the "notes" section.  
Return only the updated JSON object.

Current data:
{
  "date": "2025-06-05"
}

User input:
"Woke up around 9 and had a protein bar. Feeling a little tired. Didn't sleep great."
```

---

## 4. 🤖 Claude Responds:

```json
{
  "date": "2025-06-05",
  "breakfast_description": "protein bar",
  "mood": "a little tired",
  "sleep": "didn't sleep great",
  "notes": "woke up around 9"
}
```

---

## 5. 👤 User's Second Log (Same Day)

```
Just had a turkey sandwich and sparkling water for lunch. Starting to feel a bit more energetic.
```

---

## 6. 🔁 Claude Prompt (With Merged Existing Data):

```txt
You are a structured data assistant.

Below is the current JSON dataset for today.  
DO NOT change or remove existing values.  
Only add new information where fields are still empty, or append additional details to "notes".

Current data:
{
  "date": "2025-06-05",
  "breakfast_description": "protein bar",
  "mood": "a little tired",
  "sleep": "didn't sleep great",
  "notes": "woke up around 9"
}

User input:
"Just had a turkey sandwich and sparkling water for lunch. Starting to feel a bit more energetic."
```

---

## 7. ✅ Claude Merged Response:

```json
{
  "date": "2025-06-05",
  "breakfast_description": "protein bar",
  "lunch_description": "turkey sandwich and sparkling water",
  "mood": "a little tired, starting to feel a bit more energetic",
  "sleep": "didn't sleep great",
  "notes": "woke up around 9"
}
```

---

## 🔄 Final Day JSON (After All Logs)

```json
{
  "date": "2025-06-05",
  "breakfast_description": "protein bar",
  "lunch_description": "turkey sandwich and sparkling water",
  "mood": "a little tired, starting to feel a bit more energetic",
  "sleep": "didn't sleep great",
  "notes": "woke up around 9"
}
```

---

## 📌 Summary

- **One JSON file per day** = `/data/2025-06-05.json`
- **Claude only adds** to missing fields or appends new info
- **Notes and mood fields** can grow across the day
- **Final daily logs** are easy to read, export, or analyze later

---

## 🔁 This Model Supports:

- ✅ Natural, casual journaling
- ✅ Running Claude multiple times a day without overwriting
- ✅ Strong structure with flexible expression