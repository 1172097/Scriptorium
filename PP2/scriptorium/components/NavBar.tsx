// This file was created with the assistance of GPT-4
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  useEffect(() => {
    // Set initial theme based on user's preference or default
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" aria-label="Scriptorium Home">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/logo.jpg" // Path to the logo file
                    alt="Scriptorium Logo"
                    width={40} // Logo width
                    height={40} // Logo height
                    className="rounded-full"
                  />
                  <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                    Scriptorium
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/templates">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                  Templates
                </span>
              </Link>
              <Link href="/blog">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                  Blog
                </span>
              </Link>
              <Link href="/about">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300 cursor-pointer transition-colors">
                  About
                </span>
              </Link>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="hidden md:block text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Authentication Section */}
            <div className="space-x-4">
              <Link href="/login">
                <span className="cursor-pointer text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Login
                </span>
              </Link>
              <Link href="/signup">
                <span className="cursor-pointer text-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-1.5 rounded-lg transition-colors">
                  Signup
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed top-14 left-0 w-full bg-white dark:bg-gray-900 shadow-md backdrop-blur-sm p-4 shadow-lg md:hidden border-b border-gray-200 dark:border-gray-800">
            <Link href="/templates">
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Templates
              </div>
            </Link>
            <Link href="/blog">
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Blog
              </div>
            </Link>
            <Link href="/about">
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                About
              </div>
            </Link>
            <Link href="/auth/login">
              <div className="block mt-4 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Login
              </div>
            </Link>
            <Link href="/auth/signup">
              <div className="block mt-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Signup
              </div>
            </Link>
            <button
              onClick={toggleDarkMode}
              className="block mt-4 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        )}
      </nav>
      <div className="pt-14"></div> {/* Push content down */}
    </>
  );
};

export default Navbar;
