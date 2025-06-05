# 🥗 Cal – AI-Powered Local Nutrition Tracker

![Cal MVP UI](frontend/public/MVP-UI.png)

**Cal** is a lightweight, local-first nutrition and wellness logger that lets you record meals, mood, and daily health notes in natural language. It uses Claude 3.5 Sonnet to extract structured insights and saves them to a local CSV file — no cloud, no clutter.

---

## 🚀 Features

- 🧠 **Free-text logging** — just type what you ate and how you feel
- 📦 **Claude 3.5 Sonnet integration** to convert your notes into structured JSON
- 📊 **CSV data storage** for easy review and export
- 🔒 **Fully local** — your data stays on your machine
- ⚡ **Modern React UI** with real-time updates
- ⚙️ Built with **Python, FastAPI, React, and Vite**

---

## 🧱 Project Structure

```
cal/
├── backend/                   # FastAPI backend
│   ├── main.py                # FastAPI entrypoint
│   ├── api/log.py            # Route for logging user input
│   ├── services/
│   │   ├── claude_service.py # Handles Claude API call and prompt
│   │   ├── log_writer.py     # Saves structured data to CSV
│   │   └── daily_logs_manager.py # Manages daily log files
│   ├── data/                 # Local meal/mood logs directory
│   ├── prompt_template.txt   # Prompt used for Claude structuring
│   ├── prompt_schema.json    # JSON schema for structured data
│   ├── .env                  # Claude API key
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   └── hooks/           # Custom React hooks
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── setup.sh                 # One-time setup script
├── run-dev.sh              # Start both servers
├── run.sh                  # Start backend only
└── README.md
```

---

## 📥 Installation

### 1. Clone the repo

```bash
git clone https://github.com/ethanhouseworth/cal.git
cd cal
```

### 2. Run the setup script

```bash
./setup.sh
```

This will:
- Create a Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Create a `.env` file from the template

### 3. Add your Claude API key

Edit `backend/.env`:

```bash
ANTHROPIC_API_KEY=your-api-key-here
```

### 4. Start the app

```bash
./run-dev.sh
```

This launches:
- Backend API at `http://localhost:8000`
- Frontend UI at `http://localhost:5173` (Vite dev server)

---

## ✍️ Usage

1. Open `http://localhost:5173` in your browser

2. Type your daily log in natural language:
   ```
   Had a burrito with black beans for lunch. Feeling sluggish. 
   Slept 5 hours. Only had one glass of water today.
   ```

3. Click "Log Entry" and Cal will:
   - Send your input to Claude 3.5 Sonnet
   - Extract structured data (meals, mood, sleep, etc.)
   - Save it to your local CSV file
   - Display it in the table below

4. Download your data anytime with the "Download CSV" button

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

- [ ] Expand the columns and allow users to select/de-selct them
- [ ] Add a nutrition analysis on top of the natural language dataset
- [ ] Show analytics to users
- [ ] AI-generated suggestions to users
- [ ] Optional nutrition info lookup

---

## 💡 Built with Claude 4 opus/sonnet in Claude Code

---

## 🧑‍💻 Author

**Ethan Houseworth**  
[houseworthe.com](https://houseworthe.com)