# EduTrack

EduTrack is a web application designed to manage student records efficiently. It allows admins to perform CRUD operations, filter, sort, and analyze student data. Students can view their details in a read-only mode.

---

## Features

- **Role-Based Access**
  - **Admin**: Can add, edit, delete, import, and export student data.
  - **Student**: Can only view data.

- **Student Record Management**
  - Add new students with name, roll number, department, semester, and GPA.
  - Edit existing records.
  - Delete students with confirmation prompts.

- **Filtering & Sorting**
  - Search by name, semester, or department.
  - Sort by GPA, name, or semester.

- **Data Import/Export**
  - Import student data from CSV or JSON.
  - Export student data to CSV or JSON.

- **Dashboard Analytics**
  - Student count per department (bar chart).
  - GPA distribution and average per semester.
  - Highlight students with GPA > 3.0.
  - List students with GPA < 2.0.
  - Top 5 performers per department/semester.

---

## Tech Stack

- **Frontend**: React, Axios, CSS
- **Backend**: Django
- **Database**: SQLite3 (default Django database file: `db.sqlite3`)

---

## Project Structure

```
EduTrack/
│
├── backend/
│   ├── manage.py
│   ├── db.sqlite3
│   ├── edutrack/              # Django project settings
│   └── students/              # App for student management
│
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│
├── README.md
└── requirements.txt
```

---

## Installation & Setup

### Backend Setup (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/EduTrack.git
   cd EduTrack/backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

---

## Usage

1. Start both backend and frontend servers.
2. Open `http://localhost:3000` in your browser.
3. Select a role:
   - **Admin**: Full access to manage data.
   - **Student**: View-only access.
4. Perform desired operations based on your role.

---

## Demo Video

Watch the full walkthrough of EduTrack here:  
[🎥 EduTrack Demo on Loom](https://www.loom.com/share/628f2295139a406590511c1fe9bc57c0?sid=dc28bc04-1585-4864-90e1-e760eccd8981)


