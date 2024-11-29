// This file was created with the assistance of GPT-4
import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] pt-20 px-4 md:px-0">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
        Welcome to Scriptorium edited
      </h1>
      <p className="text-base md:text-lg mb-6 text-center">
        Your platform for creating, executing, and sharing code templates and blog posts.
      </p>
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Link
          href="/p"
          className="w-full md:w-auto text-center px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Explore Posts
        </Link>
        <Link
          href="/t"
          className="w-full md:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Explore Templates
        </Link>
      </div>
    </div>
  );
};

export default Home;
