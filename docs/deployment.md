# Cloud Deployment

## Frontend — Firebase Hosting

```bash
cd frontend
npm install
npm run build

npm install -g firebase-tools
firebase login
cd ..
firebase init hosting
firebase deploy --only hosting
```

Use `frontend/dist` as the hosting directory and enable the single-page-app rewrite.

## Firebase services

Enable:

- Authentication / Email-Password
- Firestore
- Storage

Deploy rules:

```bash
firebase deploy --only firestore:rules,storage
```

## Backend — Cloud Run

Create a production Dockerfile around the FastAPI application. A typical command is:

```bash
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/diet-planner/api
gcloud run deploy diet-planner-api \
  --image REGION-docker.pkg.dev/PROJECT_ID/diet-planner/api \
  --region asia-south1 \
  --platform managed
```

Configure environment variables/secrets through the hosting platform. Do not put a service-account JSON file into the repository.

## Important

Cloud provider pricing and free-tier limits can change. Confirm current quotas/pricing in the provider console before deployment.

## Optional ML API

The project specification includes a Flask/Sentence-BERT extension on Cloud Run. It is intentionally an optional extension because model downloads and runtime memory can make a student deployment heavier than the deterministic baseline.
