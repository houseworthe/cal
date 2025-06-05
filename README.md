# 🤖 Cal – Your AI Wellness Agent

![Cal MVP UI](frontend/public/MVP-UI.png)

**Cal** is your personal AI wellness agent — a lightweight, local-first nutrition and wellness tracker that understands natural language. Powered by Claude 3.5 Sonnet, Cal intelligently converts your meal descriptions, mood notes, and daily health observations into structured insights, all stored locally on your machine.

---

## 🚀 Features

- 🧠 **AI-powered natural language processing** — just describe what you ate and how you feel
- 🤖 **Intelligent data extraction** via Claude 3.5 Sonnet to structure your wellness notes
- 📊 **Local CSV storage** for complete data ownership and easy export
- 🔒 **Privacy-first** — your wellness data never leaves your machine
- ⚡ **Modern React interface** with real-time AI processing
- 🎯 **Personalized wellness insights** from your daily logs

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

3. Click "Log Entry" and your AI wellness agent will:
   - Analyze your input using Claude 3.5 Sonnet
   - Intelligently extract structured wellness data (meals, mood, sleep, etc.)
   - Save insights to your local CSV file
   - Display personalized wellness tracking in the table below

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

- [ ] Expand wellness tracking columns with user customization
- [ ] AI-powered nutrition analysis and recommendations
- [ ] Personalized wellness analytics and trend insights
- [ ] Intelligent health suggestions based on your data patterns
- [ ] Enhanced AI agent capabilities for proactive wellness coaching

---

## 💡 Built with Claude 4 opus/sonnet in Claude Code

---

## 🧑‍💻 Author

**Ethan Houseworth**  
[houseworthe.com](https://houseworthe.com)