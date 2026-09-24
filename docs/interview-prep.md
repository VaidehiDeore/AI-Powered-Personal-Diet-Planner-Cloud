# Interview Preparation

## 1. Explain your project.
I built a cloud-oriented personal diet planner as a full-stack academic project. The React frontend collects a user's general wellness preferences, the backend validates the profile and calculates educational target estimates, and a rule-based recommendation engine creates a structured meal-plan example. Firebase Authentication, Firestore and Storage provide the cloud identity, database and object-storage concepts. I also added tests, local simulation, security rules and a deployment path.

## 2. Where is cloud computing used?
The application separates the browser from managed cloud services. Firebase can provide authentication, Firestore provides a managed database, Storage provides object storage, Firebase Functions demonstrate serverless execution, and the FastAPI backend can be deployed to Cloud Run.

## 3. Why use Firestore?
Firestore is a managed NoSQL document database. It is suitable for user-scoped profile, plan and intake documents and removes the need to manage a database server manually.

## 4. What is cloud storage in this project?
Cloud Storage is for files such as optional meal or food images. The database stores structured metadata while the object itself belongs in Storage.

## 5. How does authentication work?
Firebase Authentication establishes the user's identity. In cloud mode the frontend obtains an ID token and sends it to the backend. The backend verifies the token and uses the verified UID for authorization.

## 6. What are REST APIs?
REST APIs expose application operations through HTTP methods and predictable endpoints. For example, `GET /profile` reads a profile and `POST /generate-plan` creates a plan.

## 7. How is AI used?
The baseline recommendation engine is deterministic and rule-based. It filters foods according to dietary preference and uses target calories/macros to build meal slots. An optional external AI or Sentence-BERT service can be added later without changing the frontend contract.

## 8. How can the project scale?
The frontend can be served through a CDN/managed hosting platform, the API can run as multiple stateless instances, Firestore and object storage are managed services, and background queues/functions can handle heavier recommendation work.

## 9. What security measures did you use?
I separated authentication from authorization, use UID-scoped Firestore and Storage rules, validate inputs, restrict uploads, keep credentials out of source control, and avoid trusting arbitrary frontend user IDs.

## 10. What happens if an AI service fails?
The application keeps a local rule-based baseline. The recommendation response uses a stable structured format, so the frontend can render the fallback without depending on an external AI provider.
