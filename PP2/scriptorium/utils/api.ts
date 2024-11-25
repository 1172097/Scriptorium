// This file was created with the assistance of GPT-4

// Dynamically set the base URL based on the current environment
const getBaseURL = (): string => {
  if (window.location.hostname === "localhost") {
    return "http://localhost:3000/api"; // Development backend URL
  } else {
    return `${window.location.origin}/api`; // Production backend URL
  }
};

const BASE_URL = getBaseURL();

// Core fetch wrapper for making API calls
export const fetchWrapper = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login on unauthorized access
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }

    return response.json(); // Parse JSON response
  } catch (error) {
    console.error("API Error:", error);
    throw error; // Rethrow error to the caller
  }
};

// Shortcut functions for HTTP methods
export const api = {
  get: (endpoint: string) => fetchWrapper(endpoint),
  post: (endpoint: string, body: any) =>
    fetchWrapper(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) =>
    fetchWrapper(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWrapper(endpoint, { method: "DELETE" }),
};
