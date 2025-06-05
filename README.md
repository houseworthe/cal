# 🥗 Cal – AI-Powered Local Nutrition Tracker

**Cal** is a lightweight, local-first nutrition and wellness logger that lets you record meals, mood, and daily health notes in natural language. It uses Claude 3.5 Sonnet to extract structured insights and saves them to a local CSV file — no cloud, no clutter.

---

## 🚀 Features

- 🧠 **Free-text logging** — just type what you ate and how you feel
- 📦 **Claude 3.5 Sonnet integration** to convert your notes into structured JSON
- 📊 **CSV data storage** for easy review and export
- 🔒 **Fully local** — your data stays on your machine
- ⚙️ Built with **Python, FastAPI, and Claude Code**

---

## 🧱 Project Structure

```
cal/
├── backend/
│   ├── main.py                 # FastAPI entrypoint
│   ├── api/log.py             # Route for logging user input
│   ├── services/
│   │   ├── claude_service.py  # Handles Claude API call and prompt
│   │   └── log_writer.py      # Saves structured data to CSV
│   ├── data/logs.csv          # Local meal/mood logs
│   ├── prompt_template.txt    # Prompt used for Claude structuring
│   ├── .env                   # Claude API key
│   └── requirements.txt       # Python dependencies
├── run.sh                     # One-liner to launch dev server
└── README.md
```

---

## 📥 Installation

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/cal.git
cd cal
```

### 2. Add your Claude API key

Create a `.env` file inside `/backend`:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

### 3. Set up dependencies

If you're using Python UV:

```bash
cd backend
uv pip install -r requirements.txt
```

Or use Docker:

```bash
docker-compose up --build
```

### 4. Run the app

```bash
./run.sh
```

---

## ✍️ Usage

1. Go to `http://localhost:8000/docs`

2. Use the `/log` endpoint to POST your text:

```json
{
  "input": "Had a burrito with black beans. Feeling sluggish. Slept 5 hours. Only had one glass of water."
}
```

3. The app will:
   - Send your input to Claude 3.5 Sonnet
   - Get structured JSON in return
   - Save that data as a new row in `logs.csv`

4. Use the `/view` endpoint to download or preview your data

---

## 🧠 Claude Prompt Structure

Cal uses a strict JSON format with fields:

- `date`
- `breakfast_description`
- `lunch_description`
- `dinner_description`
- `snack_description`
- `mood`
- `hydration`
- `sleep`
- `activity`
- `notes`

Missing fields are simply omitted.

---

## 🛡️ Privacy

- Cal stores all data locally
- No logs, analytics, or cloud sync
- You control your data, always

---

## 📌 Roadmap

- [ ] Add support for hydration reminders
- [ ] Build a simple web frontend or CLI
- [ ] Export data summaries (weekly/monthly)
- [ ] Optional nutrition info lookup

---

## 💡 Inspired By

- Claude 3.5 Sonnet
- Personal health journaling
- The idea that logging should feel like texting

---

## 🧑‍💻 Author

**Ethan Houseworth**  
[houseworthe.com](https://houseworthe.com)