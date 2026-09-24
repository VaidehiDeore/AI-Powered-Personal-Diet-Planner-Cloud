# Local Simulation

1. Install Node.js and Python 3.11+.
2. Open the project in VS Code.
3. Start backend:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

4. Start frontend in another terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

5. Open `http://localhost:5173`.
6. Register a demo account or use local mode.
7. Save the profile.
8. Generate a plan.
9. Confirm it appears under Saved plans.
10. Upload a synthetic/demo file.
11. Verify the file is associated with the local demo user.
12. Run `pytest -q` in `backend`.

For a cloud-like local workflow, install Firebase CLI and run the Firebase Emulator Suite with the project's Auth, Firestore and Functions configuration.
