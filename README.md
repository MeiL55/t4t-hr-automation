# T4T-HR-AUTOMATION

An internal HR automation platform for **Teens 4 Teens (T4T)** — a youth-led nonprofit focused on teenage menstrual health advocacy. This system is designed to streamline T4T's recruitment, interview scheduling, and volunteer management workflows through a modern, full-stack web application.

---

## Team Members

- **Frontend Developers**
  - [Finlay McAfee](https://github.com/alicezhang)
  - [Brian Lee](https://www.linkedin.com/in/brian-lee-dev)

- **Full Stack Developer**
  - [Mei Li](https://github.com/MeiL55)

- **Software Technical Assistant**
  - [Prabhav Rao](https://www.linkedin.com/in/jordan-kim-tech)


---

## About the Organization

**Teens 4 Teens**, a 501(c)3 non-profit, empowers young women, and their economies, globally with period care and menstrual education so that no one has to suffer in silence.
Check our website: https://www.teens4teens.net/ for more details.

---

## Project Features

- Role-based login system for applicants and HR staff
- Dynamic application form builder
- Integrated interview scheduling with Calendly
- Resume parsing and status tracking
- Email notifications and HR feedback pipeline
- Admin dashboard for real-time tracking and analytics

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** Firebase (auth & storage) and planned relational support (PostgreSQL)
- **Dev Tools:** Docker (WIP), ESLint, Vercel (frontend), Render (backend)

---

## Project Structure

```txt
T4T-HR-AUTOMATION/
│
├── backend/                # Flask backend application
│   ├── controllers/        # Business logic and service layer
│   ├── models/             # Database models (e.g., SQLAlchemy)
│   ├── routes/             # API endpoints (Flask Blueprints)
│   ├── tests/              # Unit and integration tests for backend
│   ├── utils/              # Helper functions (e.g., JWT, validators)
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
│   └── README.md           # Frontend-specific documentation (optional)
│
├── .gitignore              # Global ignores (Python, system files, etc.)
├── LICENSE                 # Project license
└── README.md               # Root-level documentation
