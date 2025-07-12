# T4T-HR-AUTOMATION

An internal HR automation platform for **Teens 4 Teens (T4T)** — a youth-led nonprofit focused on teenage menstrual health advocacy. This system is designed to streamline T4T's recruitment, interview scheduling, and volunteer management workflows through a modern, full-stack web application.

---

## Development Team

- **Frontend Developers**
  - [Finlay McAfee](https://www.linkedin.com/in/finlay-mcafee)
  - [Himanshu Panchal](https://www.linkedin.com/in/himanshu--panchal/)

- **Full Stack Developer**
  - [Mei Li](https://www.linkedin.com/in/mei-li-ba800b290/)

- **Software Technical Assistant**
  - [Prabhav Rao](https://www.linkedin.com/in/prabhav-rao-119aa0262/)


---

## About the Organization

**[Teens 4 Teens](https://www.teens4teens.net/)**, a 501(c)3 non-profit, empowers young women, and their economies, globally with period care and menstrual education so that no one has to suffer in silence.

---

## Project Features

- Role-based login system for applicants and HR staff
- Dynamic application form builder
- Integrated interview scheduling with Calendly
- Resume parsing and status tracking
- Email notifications and HR feedback pipeline
- Admin dashboard for real-time tracking and analytics

---

## Tech Stacks

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** SQLAlchemy + Supabase (cloud hosting)
- **Dev Tools:** Docker(expected), ESLint, Vercel (frontend)

---

## Project Structure

```txt
T4T-HR-AUTOMATION/
│
├── backend/                # Flask backend application
│   ├── services/           # Service layer - resume parsing, screening, email sending, resume uploading to cloud, etc.
│   ├── models/             # SQL Database models
│   ├── routes/             # API endpoints (Flask Blueprints)
│   ├── tests/              # Unit and integration tests for backend
│   ├── utils/              # Helper functions (e.g. createdb.py)
│   ├── app.py              # Flask app entry point
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # Next.js frontend application
│   ├── node_modules/       # Node.js packages (auto-generated)
│   ├── public/             # Static assets (images, favicon, etc.)
│   ├── src/                # App source code (pages, components, etc.)
│   ├── .gitignore          # Node/Next-specific ignores
│   ├── eslint.config.mjs   # ESLint configuration
│   ├── next.config.ts      # Next.js config
│   ├── tsconfig.json       # TypeScript configuration
│   ├── package.json        # Frontend project dependencies and scripts
│   ├── package-lock.json   # Dependency lock file
│   └── README.md           # Frontend-specific documentation
│
├── .gitignore              # Global ignores (Python, system files, etc.)
├── LICENSE                 # Project license
└── README.md               # Root-level documentation
