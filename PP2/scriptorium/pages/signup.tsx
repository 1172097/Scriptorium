import React, { useState } from 'react';

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF] dark:bg-[#3F384C] p-4">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#2D2640] rounded-2xl p-10 shadow-lg">
        <h1 className="text-[#6A5294] dark:text-[#D4BBFF] text-3xl font-bold text-center mb-8">
          Create Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label 
              htmlFor="username" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Choose a password"
            />
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6A5294] dark:bg-[#D4BBFF] text-white dark:text-[#3F384C] 
                     py-3 rounded-lg font-semibold hover:bg-[#563E80] 
                     dark:hover:bg-[#EBDCFF] transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6A5294B3] dark:text-[#D4BBFFB3]">
          By signing up, you agree to our{' '}
          <a href="#" className="text-[#6A5294] dark:text-[#D4BBFF] hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-[#6A5294] dark:text-[#D4BBFF] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}