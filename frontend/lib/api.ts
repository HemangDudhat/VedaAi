const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Base API client with error handling
 */
async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `API Error: ${response.status}`);
  }

  return data;
}

// --- Assignment API ---

export const assignmentApi = {
  list: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    apiClient("/assignments", { params }),

  get: (id: string) => apiClient(`/assignments/${id}`),

  create: (data: FormData) =>
    apiClient("/assignments", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: data,
    }),

  delete: (id: string) =>
    apiClient(`/assignments/${id}`, { method: "DELETE" }),

  regenerate: (id: string) =>
    apiClient(`/assignments/${id}/regenerate`, { method: "POST" }),

  uploadFile: (file: File): Promise<{ success: boolean; data: any; error?: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient("/assignments/upload", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};
