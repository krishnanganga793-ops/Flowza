import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("focusflow_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry && !original?.url?.includes("/auth/login")) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("focusflow_access_token", data.accessToken);
        localStorage.setItem("focusflow_user", JSON.stringify(data.user));
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("focusflow_access_token");
        localStorage.removeItem("focusflow_user");
      }
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error, fallback = "Request failed") {
  const data = error.response?.data;
  const fieldErrors = data?.errors?.fieldErrors;

  if (fieldErrors) {
    const messages = Object.entries(fieldErrors)
      .flatMap(([field, errors]) => (errors || []).map((message) => `${field}: ${message}`))
      .filter(Boolean);

    if (messages.length) return messages.join(" ");
  }

  return data?.message || fallback;
}

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then((res) => res.data),
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  logout: () => api.post("/auth/logout").then((res) => res.data),
  me: () => api.get("/auth/me").then((res) => res.data),
  profile: (payload) => api.put("/auth/profile", payload).then((res) => res.data)
};

export const taskApi = {
  list: (params) => api.get("/tasks", { params }).then((res) => res.data),
  create: (payload) => api.post("/tasks", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
  duplicate: (id) => api.post(`/tasks/${id}/duplicate`).then((res) => res.data)
};

export const habitApi = {
  list: () => api.get("/habits").then((res) => res.data),
  create: (payload) => api.post("/habits", payload).then((res) => res.data),
  update: (id, payload) => api.put(`/habits/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/habits/${id}`).then((res) => res.data),
  complete: (id, payload = {}) => api.post(`/habits/${id}/complete`, payload).then((res) => res.data)
};

export const timerApi = {
  start: (payload) => api.post("/timer/start", payload).then((res) => res.data),
  stop: (payload = {}) => api.post("/timer/stop", payload).then((res) => res.data),
  manual: (payload) => api.post("/timer/manual", payload).then((res) => res.data),
  report: (range = "week") => api.get("/timer/report", { params: { range } }).then((res) => res.data)
};

export const analyticsApi = {
  summary: () => api.get("/analytics/summary").then((res) => res.data)
};
