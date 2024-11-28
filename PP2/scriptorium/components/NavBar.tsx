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
  const [profile, setProfile] = useState<{ username: string; profile_picture: string } | null>(null);
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
    setIsLoggedIn(isAuthenticated());

    if (isAuthenticated()) {
      api.get(`/auth/profile`)
        .then((response) => {
          const user = response.user;
          setProfile({
            username: user.username,
            profile_picture: user.profile_picture || "/public/default_profile_pic.png",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch profile", err);
        });
    }

    const handleLoginSuccess = () => {
      setIsLoggedIn(isAuthenticated());
      router.reload();
    };

    window.addEventListener("userLoggedIn", handleLoginSuccess);
    return () => window.removeEventListener("userLoggedIn", handleLoginSuccess);
  }, []);

  const handleSignOut = () => {
    removeToken();
    setIsLoggedIn(false);
    closeMenu();
    router.push("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--card-background)] shadow-md backdrop-blur-sm border-b border-[var(--border)]">
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
                  <span className="ml-2 text-lg font-semibold text-[var(--text-primary)]">
                    Scriptorium
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/t">
                <span className="text-sm text-[var(--text-primary)] hover:opacity-80">
                  Templates
                </span>
              </Link>
              <Link href="/p">
                <span className="text-sm text-[var(--text-primary)] hover:opacity-80">
                  Posts
                </span>
              </Link>
              <Link href="/about">
                <span className="text-sm text-[var(--text-primary)] hover:opacity-80">
                  About
                </span>
              </Link>

              <button
                onClick={toggleDarkMode}
                className="text-sm text-[var(--text-primary)] hover:opacity-80"
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
                        alt={`${profile.username}'s profile picture`}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <span className="ml-2 text-sm text-[var(--text-primary)] hover:opacity-80">
                        {profile.username}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="cursor-pointer text-sm bg-[var(--highlight)] text-[var(--highlight-text)] 
                             px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link href="/login">
                    <span className="cursor-pointer text-sm text-[var(--text-primary)] hover:opacity-80">
                      Login
                    </span>
                  </Link>
                  <Link href="/signup">
                    <span className="cursor-pointer text-sm bg-[var(--highlight)] text-[var(--highlight-text)]
                                   px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                      Signup
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[var(--text-primary)] hover:opacity-80"
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed top-14 left-0 w-full bg-[var(--card-background)] shadow-md backdrop-blur-sm p-4 
                         shadow-lg md:hidden border-b border-[var(--border)]">
            <Link href="/t" onClick={closeMenu}>
              <div className="block mb-2 text-[var(--text-primary)] hover:opacity-80">
                Templates
              </div>
            </Link>
            <Link href="/p" onClick={closeMenu}>
              <div className="block mb-2 text-[var(--text-primary)] hover:opacity-80">
                Posts
              </div>
            </Link>
            <Link href="/about" onClick={closeMenu}>
              <div className="block mb-2 text-[var(--text-primary)] hover:opacity-80">
                About
              </div>
            </Link>
            {isLoggedIn && profile ? (
              <>
                <Link href="/profile" onClick={closeMenu}>
                  <div className="block mt-4 text-[var(--text-primary)] hover:opacity-80">
                    {profile.username}
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block mt-2 text-sm text-[var(--text-primary)] hover:opacity-80"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <div className="block mt-4 text-[var(--text-primary)] hover:opacity-80">
                    Login
                  </div>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <div className="block mt-2 text-[var(--text-primary)] hover:opacity-80">
                    Signup
                  </div>
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="block mt-4 text-sm text-[var(--text-primary)] hover:opacity-80"
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
