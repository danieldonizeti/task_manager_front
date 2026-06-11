import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Anexando o token automaticamente em toda requisição
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Tentando renovar o token caso a API retorne 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        // Ignora rotas de autenticação — deixa o erro chegar no catch da página
        const isAuthRoute =
            original.url.includes("auth/login") ||
            original.url.includes("auth/refresh") ||
            original.url.includes("users");

        if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
            original._retry = true;

            try {
                const refresh = localStorage.getItem("refresh_token");
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/auth/refresh/`,
                    { refresh }
                );

                localStorage.setItem("access_token", data.access);
                original.headers.Authorization = `Bearer ${data.access}`;
                return api(original);
            } catch {
                // Refresh expirou — desloga o usuário
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;