// This file was created with the assistance of GPT-4

export const setTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };
  
  export const getTheme = (): "light" | "dark" => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light";
  };
  
  export const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };
