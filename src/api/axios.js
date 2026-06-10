import axios from "axios";

const baseURL = window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL,
});

// anexando os tokens automaticamente token de acesso
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Tentando renovar o token caso a api retorne 401
api.interceptors.response.use(
    (response) => response,
    async (error) =>{
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refresh = localStorage.getItem("refresh_token");
                const { data } = await axios.post(
                    "https://task-manager-ag0w.onrender.com/api/auth/refresh/",
                    { refresh }
                );

                localStorage.setItem("access_token", data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return api(original);
            }catch {
                // Na hora que expirar, desloga o usuario
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;