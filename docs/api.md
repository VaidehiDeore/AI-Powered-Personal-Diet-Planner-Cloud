# REST API

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Service health |
| GET | /profile | Get current user's profile |
| PUT | /profile | Save current user's profile |
| GET | /targets | Compute educational target estimates |
| POST | /generate-plan | Generate and save a plan |
| GET | /plans | List current user's plans |
| GET | /plans/{id} | Read one current user's plan |
| DELETE | /plans/{id} | Delete one current user's plan |
| GET | /intake | Read intake summary |
| POST | /intake | Add intake item |
| POST | /files | Upload file |
| GET | /files | List user files |
| DELETE | /files/{id} | Delete user file |

The cloud-authenticated version uses a Firebase ID token in the `Authorization: Bearer <token>` header.
