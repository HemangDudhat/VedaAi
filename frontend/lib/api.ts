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
  const { params, headers: customHeaders, ...restOptions } = options;

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

  const isFormData = restOptions.body instanceof FormData;
  
  // We use Record<string, string> for simpler merging
  const headers: Record<string, string> = {
    ...((customHeaders as Record<string, string>) || {}),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  } else if (isFormData && headers["Content-Type"]) {
    delete headers["Content-Type"]; // let browser set boundary
  }

  const response = await fetch(url, {
    headers,
    credentials: "include",
    ...restOptions,
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

  uploadFiles: (files: File[]): Promise<{ success: boolean; data: any; error?: string }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("files", file);
    });
    return apiClient("/assignments/upload", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};

// --- Library API ---
export const libraryApi = {
  list: () => apiClient("/library/documents"),
  upload: (files: File[]): Promise<{ success: boolean; data: any; error?: string }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiClient("/library/documents/upload", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
  delete: (id: string) => apiClient(`/library/documents/${id}`, { method: "DELETE" }),
};
