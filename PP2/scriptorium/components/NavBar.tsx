import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { api } from "@/utils/api";
// import { isAuthenticated, removeToken } from "@/utils/auth";

const Navbar: React.FC = () => {
  // Theme state
  // const [theme, setTheme] = useState("light");
  // Authentication states
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Check authentication status and fetch user data on mount
  // useEffect(() => {
  // const loggedIn = isAuthenticated();
  // setIsLoggedIn(loggedIn);
  //
  // if (loggedIn) {
  // api.get("/users/me")
  // .then((response) => setUser(response.data))
  // .catch(() => setIsLoggedIn(false));
  // }
  // }, []);

  // Theme toggle handler
  // const toggleTheme = () => {
  // const newTheme = theme === "light" ? "dark" : "light";
  // setTheme(newTheme);
  // document.documentElement.setAttribute("data-theme", newTheme);
  // };

  // Logout handler
  // const handleLogout = () => {
  // removeToken();
  // setIsLoggedIn(false);
  // setUser(null);
  // window.location.href = "/";
  // };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Scriptorium
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                Templates
              </span>
              <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                Blog
              </span>
              <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                About
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button className="hidden md:block text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
              Dark Mode
            </button>

            {/* Authentication Section */}
            <div className="space-x-4">
              <span className="cursor-pointer text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Login
              </span>
              <span className="cursor-pointer text-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-1.5 rounded-lg transition-colors">
                Signup
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
            >
              ☰
            </button>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="fixed top-14 left-0 w-full bg-white dark:bg-gray-900 shadow-md backdrop-blur-sm p-4 shadow-lg md:hidden border-b border-gray-200 dark:border-gray-800">
                <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Templates
                </div>
                <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Blog
                </div>
                <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  About
                </div>
                <div className="block mt-4 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Login
                </div>
                <div className="block mt-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Signup
                </div>
                <button className="block mt-4 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Dark Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="pt-14"></div> {/* Add this div to push the content down */}
    </>
  );
};

export default Navbar;