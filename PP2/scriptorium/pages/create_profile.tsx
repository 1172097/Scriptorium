import React, { useState } from 'react';

interface FormData {
  firstname: string;
  lastname: string;
  phoneNumber: string;
}

export default function CreateProfile() {
  const [formData, setFormData] = useState<FormData>({
    firstname: '',
    lastname: '',
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF7FF] dark:bg-[#3F384C] p-4">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#2D2640] rounded-2xl p-10 shadow-lg">
        <h1 className="text-[#6A5294] dark:text-[#D4BBFF] text-3xl font-bold text-center mb-8">
          Create Profile
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label 
              htmlFor="firstname" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label 
              htmlFor="lastname" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label 
              htmlFor="phoneNumber" 
              className="block text-[#6A5294E6] dark:text-[#D4BBFFE6] text-sm font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 bg-[#FEF7FF] dark:bg-[#3F384C] border border-[#6A529433] 
                       dark:border-[#D4BBFF33] rounded-lg focus:outline-none 
                       focus:bg-[#EBDCFF] dark:focus:bg-[#513A7A] 
                       text-[#6A5294] dark:text-[#D4BBFF]
                       placeholder-[#6A5294B3] dark:placeholder-[#D4BBFFB3]"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#6A5294] dark:bg-[#D4BBFF] text-white dark:text-[#3F384C] 
                     py-3 rounded-lg font-semibold hover:bg-[#563E80] 
                     dark:hover:bg-[#EBDCFF] transition-colors"
          >
            Create Profile
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6A5294B3] dark:text-[#D4BBFFB3]">
          By creating a profile, you agree to our{' '}
          <a href="#" className="text-[#6A5294] dark:text-[#D4BBFF] hover:underline">
            Terms
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