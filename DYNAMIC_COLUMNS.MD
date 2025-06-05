# 🧠 Daily Wellness Log – Schema Expansion Plan

## 1. 🔧 Core Structure

### ✅ Required Fields
| Field       | Type    | Notes                        |
|-------------|---------|------------------------------|
| `date`      | string  | ISO format (e.g. 2025-06-06) |
| `timestamp` | string  | Time log was created (ISO)   |

---

## 2. 🧩 Optional Fields (Default)

Users can toggle these fields on/off in settings:

| Field                  | Type    | Description                             |
|------------------------|---------|-----------------------------------------|
| `breakfast_description`| text    | User description of breakfast           |
| `lunch_description`    | text    | User description of lunch               |
| `dinner_description`   | text    | User description of dinner              |
| `snack_description`    | text    | User description of snacks              |
| `mood`                 | text    | How the user feels                      |
| `sleep`                | text    | Hours or description of sleep           |
| `hydration`            | text    | Water or fluids consumed                |
| `activity`             | text    | Physical movement, workouts, etc.       |
| `notes`                | text    | Freeform observations                   |

---

## 3. ➕ Custom Fields (User-Defined)

Users can define **custom wellness trackers** with flexible types:

| Field        | Type         | Input UI       | Example Values                  |
|--------------|--------------|----------------|---------------------------------|
| `alcohol`    | boolean      | toggle         | `true`, `false`                 |
| `caffeine`   | number       | number input   | `200` (mg)                      |
| `marijuana`  | text         | dropdown       | `Relaxation`, `Focus`           |
| `exercise_type` | text     | text input     | `Cardio`, `Weights`             |
| `supplements`| multi-select | checkboxes     | `["Vitamin D", "Magnesium"]`    |

---

## 4. 🛠️ Settings Panel: "Customize My Logs"

Add a UI page where users can:
- ✅ Enable/disable default fields
- ➕ Add new custom fields (label, type, default value)
- ✏️ Rename or edit existing fields
- 🗑️ Remove or hide fields from UI

---

## 5. 💾 Backend Data Format

Switch to a dynamic JSON-based structure per log:

```json
{
  "date": "2025-06-06",
  "timestamp": "2025-06-06T09:00:00Z",
  "fields": {
    "breakfast_description": "Yogurt",
    "mood": "Tired",
    "alcohol": false,
    "marijuana": "Relaxation",
    "caffeine": 150
  }
}
fields is a key-value map of enabled fields for that user

Supports any number of default or custom entries

Keeps logs extensible and future-proof

✅ Summary
This schema + system:

Preserves flexibility and user ownership

Enables richer insights through personalized data

Future-proofs Cal for advanced wellness tracking