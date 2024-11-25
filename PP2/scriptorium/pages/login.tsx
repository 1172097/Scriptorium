import React, { useState } from 'react';

interface LoginData {
  username: string;
  password: string;
}

export default function Login() {
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempted:', loginData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF] dark:bg-[#3F384C] p-4">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#2D2640] rounded-2xl p-10 shadow-lg">
        <h1 className="text-[#6A5294] dark:text-[#D4BBFF] text-3xl font-bold text-center mb-8">
          Welcome Back
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
              value={loginData.username}
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
              htmlFor="password" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6A5294] dark:bg-[#D4BBFF] text-white dark:text-[#3F384C] 
                     py-3 rounded-lg font-semibold hover:bg-[#563E80] 
                     dark:hover:bg-[#EBDCFF] transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6A5294B3] dark:text-[#D4BBFFB3]">
          Don't have an account?{' '}
          <a href="./signup" className="text-[#6A5294] dark:text-[#D4BBFF] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}