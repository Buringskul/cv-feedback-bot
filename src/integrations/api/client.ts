// src/integrations/api/client.ts
export type ApiUser = { id?: string; email: string; name?: string };
export type LoginResponse = { token: string; user: ApiUser };

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function post<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  register: (email: string, password: string, name?: string) =>
    post<{ userId: string }>("/register", { email, password, name }),
  login: (email: string, password: string) =>
    post<LoginResponse>("/login", { email, password }),
};
