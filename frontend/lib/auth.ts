const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const post = async (endpoint: string, body: object) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const signupApi = (body: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => post("/auth/signup", body);

export const verifyOtpApi = (body: { email: string; otp: string }) =>
  post("/auth/verify-otp", body);

export const resendOtpApi = (body: { email: string }) =>
  post("/auth/resend-otp", body);

export const loginApi = async (body: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || "Login failed") as any;
    err.needsVerification = data.needsVerification;
    err.email = data.email;
    throw err;
  }
  return data;
};

export const logoutApi = async () => {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};

export const updateProfileApi = async (body: {
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  schoolName?: string;
  schoolAddress?: string;
  schoolProfile?: string;
}) => {
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
};

export const getImageKitAuthApi = async () => {
  const res = await fetch(`${API_BASE}/users/imagekit-auth`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error("Failed to get ImageKit auth");
  return data;
};
