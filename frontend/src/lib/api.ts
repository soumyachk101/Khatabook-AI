export interface ApiResponse<T = unknown> {
 success: boolean;
 data?: T;
 error?: string;
 message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
 pagination: {
 page: number;
 limit: number;
 total: number;
 totalPages: number;
 };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
 if (!response.ok) {
 const error = await response.json().catch(() => ({ message: response.statusText }));
 return { success: false, error: error.message || error.error || "An error occurred" };
 }
 return response.json();
}

export async function get<T>(path: string): Promise<ApiResponse<T>> {
 const res = await fetch(`${API_BASE}${path}`, { headers: { "Content-Type": "application/json" } });
 return handleResponse<T>(res);
}

export async function post<T>(path: string, data: unknown): Promise<ApiResponse<T>> {
 const res = await fetch(`${API_BASE}${path}`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data),
 });
 return handleResponse<T>(res);
}

export async function put<T>(path: string, data: unknown): Promise<ApiResponse<T>> {
 const res = await fetch(`${API_BASE}${path}`, {
 method: "PUT",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(data),
 });
 return handleResponse<T>(res);
}

export async function del<T>(path: string): Promise<ApiResponse<T>> {
 const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
 return handleResponse<T>(res);
}

export async function postFormData<T>(path: string, formData: FormData): Promise<ApiResponse<T>> {
 const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: formData });
 return handleResponse<T>(res);
}
