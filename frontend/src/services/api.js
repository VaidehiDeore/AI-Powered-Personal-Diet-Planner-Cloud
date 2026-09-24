import { auth, firebaseConfigured } from "../firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const headers = { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(options.headers || {}) };

  if (firebaseConfigured && auth?.currentUser) {
    headers.Authorization = `Bearer ${await auth.currentUser.getIdToken()}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || data?.error?.message || "Request failed");
  }
  return data;
}

export const api = {
  health: () => request("/health"),
  profile: () => request("/profile"),
  saveProfile: (profile) => request("/profile", { method: "PUT", body: JSON.stringify(profile) }),
  targets: () => request("/targets"),
  generatePlan: (payload) => request("/generate-plan", { method: "POST", body: JSON.stringify(payload) }),
  plans: () => request("/plans"),
  plan: (id) => request(`/plans/${id}`),
  deletePlan: (id) => request(`/plans/${id}`, { method: "DELETE" }),
  intake: () => request("/intake"),
  addIntake: (payload) => request("/intake", { method: "POST", body: JSON.stringify(payload) }),
  files: () => request("/files"),
  upload: (file) => {
    const body = new FormData();
    body.append("file", file);
    return request("/files", { method: "POST", body });
  },
  deleteFile: (id) => request(`/files/${id}`, { method: "DELETE" })
};
