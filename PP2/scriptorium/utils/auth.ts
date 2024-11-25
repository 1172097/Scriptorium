// This file was created with the assistance of GPT-4

// Save the JWT token to localStorage
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

// Retrieve the JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

// Remove the JWT token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

// Check if the user is authenticated by verifying token existence
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
