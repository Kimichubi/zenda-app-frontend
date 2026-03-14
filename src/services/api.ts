const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiClient {
    private baseUrl: string;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("zenda_token");
    }

    private getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("zenda_refresh_token");
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = this.getToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
            return this.handle401<T>(endpoint, options);
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                message: "Erro inesperado",
            }));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    private async handle401<T>(endpoint: string, options: RequestInit): Promise<T> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            const refreshToken = this.getRefreshToken();

            if (!refreshToken) {
                this.logout();
                throw new Error("Sessão expirada");
            }

            try {
                const res = await fetch(`${this.baseUrl}/auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                if (!res.ok) throw new Error("Falha ao renovar token");

                const data = await res.json();
                localStorage.setItem("zenda_token", data.accessToken);
                localStorage.setItem("zenda_refresh_token", data.refreshToken);

                this.isRefreshing = false;
                this.onTokenRefreshed(data.accessToken);
                return this.request<T>(endpoint, options);
            } catch (err) {
                this.isRefreshing = false;
                this.logout();
                throw err;
            }
        }

        return new Promise<T>((resolve) => {
            this.subscribeTokenRefresh((token) => {
                resolve(this.request<T>(endpoint, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                    },
                }));
            });
        });
    }

    private subscribeTokenRefresh(cb: (token: string) => void) {
        this.refreshSubscribers.push(cb);
    }

    private onTokenRefreshed(token: string) {
        this.refreshSubscribers.forEach((cb) => cb(token));
        this.refreshSubscribers = [];
    }

    private logout() {
        if (typeof window !== "undefined") {
            localStorage.removeItem("zenda_token");
            localStorage.removeItem("zenda_refresh_token");
            window.location.href = "/login";
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: "GET" });
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }
}

export const api = new ApiClient(API_BASE_URL);
