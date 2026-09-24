# Security Checklist

- Use Firebase Authentication for identity.
- Verify Firebase ID tokens at the backend in cloud-authenticated mode.
- Never trust a frontend-provided user ID for authorization.
- Use Firestore rules to scope `/users/{uid}/...`.
- Use Storage rules to scope `/users/{uid}/...`.
- Keep backend secrets in environment variables or managed secret storage.
- Never commit `.env`, service-account keys or private credentials.
- Restrict file type and size.
- Use HTTPS in deployed environments.
- Configure CORS to known frontend origins.
- Add rate limiting at the production edge/API layer.
- Do not log passwords, tokens or private credentials.
- Do not upload real sensitive medical data to this academic demo.
- Keep the rule-based planner available as a safe dependency fallback when optional AI services fail.

The included local mode is for development only and is not a replacement for production identity controls.
