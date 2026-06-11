import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Anexando o token automaticamente em toda requisição
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        const refresh = localStorage.getItem("refresh_token");

        // Se não tem refresh token, rejeita direto sem tentar renovar
        if (!refresh) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh/`,
                    { refresh }
                );

                localStorage.setItem("access_token", data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return api(original);
            } catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;