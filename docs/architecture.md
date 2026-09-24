# Cloud Architecture

## Implemented core path

User → React/Vite → Firebase Authentication → FastAPI REST API → recommendation/calculation services → Firestore/Storage.

## Cloud concepts

| Concept | Role |
|---|---|
| SaaS | The finished browser-based planner is consumed as an application |
| PaaS | Cloud Run/Firebase-managed application hosting can run the backend |
| Cloud DB | Firestore stores structured profile, plans, intake and food catalog data |
| Object storage | Firebase Storage stores uploaded binary files |
| Authentication | Firebase Auth establishes identity |
| REST API | FastAPI exposes application endpoints |
| Serverless | Firebase Functions demonstrate callable/HTTP cloud functions |
| Scalability | Managed services and stateless APIs support horizontal scaling |
| Security | UID-based authorization, rules, HTTPS, environment configuration |
| Logging/monitoring | Provider logs and application logs can be enabled during deployment |

The project should only claim services as deployed when the deployment has actually been performed.
