import axios, { isAxiosError } from "axios";

export const apiClient = axios.create({
    baseURL: "http://localhost:5000",
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }
    
    return config;
});

let refreshToken: string | undefined;

apiClient.interceptors.response.use(undefined, async (error) => {
    if (!isAxiosError(error) || error.status !== 401 || !refreshToken || !error.config) {
        throw error;
    }

    const res = await axios.post("http://localhost:5000/refresh-token", undefined, {
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    });

    const { accessToken } = res.data;

    setToken(accessToken);

    error.config.headers.set("Authorization", `Bearer ${accessToken}`);

    return axios(error.config);
});

export function setRefreshToken(token: string) {
    refreshToken = token;
}

export function clearRefreshToken() {
    refreshToken = undefined;
}

const tokenKeyName = "token";

export function getToken() {
    return sessionStorage.getItem(tokenKeyName);
}

export function setToken(token: string) {
    sessionStorage.setItem(tokenKeyName, token);
}

export function clearToken() {
    sessionStorage.removeItem(tokenKeyName);
}
