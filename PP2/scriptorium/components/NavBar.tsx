import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/utils/api"; // API wrapper for backend calls
import { isAuthenticated, removeToken } from "@/utils/auth"; // Authentication utilities

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // Fetch user info from the backend
      api.get("/users/me")
        .then((response) => setUser(response.data))
        .catch(() => setIsLoggedIn(false)); // If user fetch fails, treat as not logged in
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    removeToken(); // Remove JWT token
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/"; // Redirect to the landing page
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[var(--background-primary)] text-[var(--text-primary)] shadow-md">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold hover:text-[var(--button-hover)]">
        Scriptorium
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        <Link to="/templates" className="hover:text-[var(--button-hover)]">Templates</Link>
        <Link to="/blog" className="hover:text-[var(--button-hover)]">Blog</Link>
        <Link to="/about" className="hover:text-[var(--button-hover)]">About</Link>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="hidden md:block text-sm hover:text-[var(--button-hover)]"
      >
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </button>

      {/* User Authentication Options */}
      {isLoggedIn ? (
        <div className="relative">
          <button
            className="hover:text-[var(--button-hover)]"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user?.firstName} {user?.lastName}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-[var(--card-background)] shadow-lg p-2 rounded">
              <Link to="/profile" className="block hover:text-[var(--button-hover)]">Profile</Link>
              <button
                onClick={handleLogout}
                className="block mt-2 text-sm hover:text-[var(--button-hover)]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="hover:text-[var(--button-hover)]">Login</Link>
          <Link to="/signup" className="hover:text-[var(--button-hover)]">Signup</Link>
        </div>
      )}

      {/* Hamburger Menu (Mobile) */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="md:hidden text-xl hover:text-[var(--button-hover)]"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--background-primary)] p-4 shadow-lg md:hidden">
          <Link to="/templates" className="block mb-2 hover:text-[var(--button-hover)]" onClick={() => setMenuOpen(false)}>
            Templates
          </Link>
          <Link to="/blog" className="block mb-2 hover:text-[var(--button-hover)]" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <Link to="/about" className="block hover:text-[var(--button-hover)]" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/profile" className="block mt-4 hover:text-[var(--button-hover)]">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block mt-2 text-sm hover:text-[var(--button-hover)]"
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link to="/login" className="block mt-4 hover:text-[var(--button-hover)]">
                Login
              </Link>
              <Link to="/signup" className="block hover:text-[var(--button-hover)]">
                Signup
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="block mt-4 text-sm hover:text-[var(--button-hover)]"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
