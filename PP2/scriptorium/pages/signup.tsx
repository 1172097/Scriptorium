// # made by chatGPT

import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await response.json();
      console.log('Form submitted:', data);
      alert('Registration successful!');
      router.push('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-[420px] bg-[var(--card-background)] rounded-2xl p-10 shadow-lg">
        <h1 className="text-[var(--text-primary)] text-3xl font-bold text-center mb-8">
          Create Account
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
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)] 
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-[var(--text-primary)] text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)]
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Enter your email"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)]
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Choose a password"
            />
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-[var(--text-primary)] text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--border)]
                       rounded-lg focus:outline-none focus:border-[var(--highlight)]
                       text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--highlight)] text-[var(--highlight-text)]
                     py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
          By signing up, you agree to our{' '}
          <a href="#" className="text-[var(--text-primary)] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[var(--text-primary)] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}