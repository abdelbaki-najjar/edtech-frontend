// lib/api.js — نسخة محدّثة مع معالجة خطأ الحد
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// خطأ خاص للحد المجاني
export class LimitReachedError extends Error {
  constructor(detail) {
    super("limit_reached");
    this.detail  = detail;
    this.contact = detail.contact;
  }
}

async function request(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  // ── خطأ الحد المجاني ──────────────────────────────────────
  if (res.status === 402) {
    throw new LimitReachedError(data.detail || {});
  }

  if (!res.ok) {
    throw new Error(data.detail || "حدث خطأ في الاتصال");
  }

  return data;
}

// ── Auth ───────────────────────────────────────────────────────
export const authAPI = {
  register: (d) => request("/api/auth/register", { method: "POST", body: JSON.stringify(d) }),
  login:    (d) => request("/api/auth/login",    { method: "POST", body: JSON.stringify(d) }),
};

// ── AI ─────────────────────────────────────────────────────────
export const aiAPI = {
  generateGame:      (d) => request("/api/ai/generate-game",      { method: "POST", body: JSON.stringify(d) }),
  generateWorksheet: (d) => request("/api/ai/generate-worksheet",  { method: "POST", body: JSON.stringify(d) }),
  analyzeStudent:    (d) => request("/api/ai/analyze",             { method: "POST", body: JSON.stringify(d) }),
  getUsage:          ()  => request("/api/ai/usage"),
};

// ── Students ───────────────────────────────────────────────────
export const studentsAPI = {
  getMe:          () => request("/api/students/me"),
  getLeaderboard: () => request("/api/students/leaderboard"),
  getProgress: (id) => request(`/api/students/${id}/progress`),
};

// ── Sessions ───────────────────────────────────────────────────
export const sessionsAPI = {
  save: (d) => request("/api/sessions/save", { method: "POST", body: JSON.stringify(d) }),
};

// ── Analytics ──────────────────────────────────────────────────
export const analyticsAPI = {
  getOverview:        () => request("/api/analytics/overview"),
  getRecommendations: () => request("/api/analytics/recommendations"),
};
