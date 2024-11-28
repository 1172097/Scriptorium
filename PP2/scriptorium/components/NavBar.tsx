import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { isAuthenticated, removeToken } from "@/utils/authFront";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState<{ username: string; profile_picture: string } | null>(
    null
  );
  const router = useRouter();

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    closeMenu();

    if (newMode) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    // Set theme based on saved preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setDarkMode(false);
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  useEffect(() => {
    // Update login state on component mount
    setIsLoggedIn(isAuthenticated());

    // Fetch user profile if logged in
    if (isAuthenticated()) {
      api.get(`/auth/profile`)
        .then((response) => {
          const user = response.user;
          setProfile({
            username: user.username,
            profile_picture: user.profile_picture || "/public/default_profile_pic.png",
          });
          setIsAdmin(user.role === "ADMIN");
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
        });
    }

    // Listen for login success event
    const handleLoginSuccess = () => {
      setIsLoggedIn(isAuthenticated());
    };

    window.addEventListener("userLoggedIn", handleLoginSuccess);

    return () => {
      window.removeEventListener("userLoggedIn", handleLoginSuccess);
    };
  }, [isLoggedIn]);

  const handleSignOut = () => {
    removeToken(); // Clear the token
    setIsLoggedIn(false); // Update state
    setIsAdmin(false); // Update state
    closeMenu(); // Close the menu
    router.push("/login"); // Redirect to login page
  };
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md dark:bg-gray-900 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" aria-label="Scriptorium Home">
                <div className="flex items-center cursor-pointer">
                  <Image
                    src="/logo.jpg"
                    alt="Scriptorium Logo"
                    width={40}
                    height={40}
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
              <Link href="/t">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Templates
                </span>
              </Link>
              <Link href="/p">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Posts
                </span>
              </Link>
              <Link href="/about">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  About
                </span>
              </Link>
            {/* Reports Link for Admins */}
            {isAdmin && (
              <Link href="/admin/reports">
                <span className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                  Reports
                </span>
              </Link>
            )}

              <button
                onClick={toggleDarkMode}
                className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              {/* Authentication Section */}
              {isLoggedIn && profile ? (
                <div className="space-x-4 flex items-center">
                  <Link href="/profile">
                    <div className="flex items-center cursor-pointer">
                      <Image
                        src={profile.profile_picture}
                        alt={""}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="ml-2 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                        {profile.username}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="cursor-pointer text-sm bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-4 py-1.5 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
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
              )}
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
            {/* Reports Link for Admins */}
            {isAdmin && (
                <Link href="/admin/reports" onClick={closeMenu}>
                  <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                    Reports
                  </div>
                </Link>
              )}
            <Link href="/t" onClick={closeMenu}>
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Templates
              </div>
            </Link>
            <Link href="/p" onClick={closeMenu}>
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                Posts
              </div>
            </Link>
            <Link href="/about" onClick={closeMenu}>
              <div className="block mb-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                About
              </div>
            </Link>
            {isLoggedIn && profile ? (
              <>
                <Link href="/profile" onClick={closeMenu}>
                  <div className="block mt-4 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                    {profile.username}
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block mt-2 text-sm text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <div className="block mt-4 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                    Login
                  </div>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <div className="block mt-2 text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300">
                    Signup
                  </div>
                </Link>
              </>
            )}
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
