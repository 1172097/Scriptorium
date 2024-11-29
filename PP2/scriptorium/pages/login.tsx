import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginData {
  username: string;
  password: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('token', data.token);
      
      const event = new Event("userLoggedIn");
      window.dispatchEvent(event);
      
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=172800; SameSite=Strict`;
      
      console.log('Login successful:', data);
      router.push('/');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-[420px] bg-[var(--card-background)] rounded-2xl p-10 shadow-lg">
        <h1 className="text-[var(--text-primary)] text-3xl font-bold text-center mb-8">
          Welcome Back
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="username" 
              className="block text-[var(--text-primary)] text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)]
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-[var(--text-primary)] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)]
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--highlight)] text-[var(--highlight-text)]
                     py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <a href="./signup" className="text-[var(--text-primary)] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}