import React, { useEffect, useState } from "react";
import { api } from "@/utils/api"; // Adjust the import path as needed

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({}); // For editing

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await api.get("/auth/profile");
        setUser(userData.user);
        setFormData(userData.user); // Initialize form data for editing
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing); // Toggle edit mode
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await api.put("/auth/profile", {
        email: formData.email,
        firstName: formData.first_name,
        lastName: formData.last_name,
        profilePicture: formData.profile_picture,
        phone: formData.phone,
        darkMode: formData.dark_mode,
        new_username: formData.username,
      });
      setUser(response.user);
      setEditing(false); // Exit edit mode
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        User Profile
      </h1>
      {user ? (
        <div className="space-y-4">
          {!editing ? (
            <>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>First Name:</strong> {user.first_name || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {user.last_name || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "N/A"}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}
              </p>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                <input
                  type="text"
                  name="profile_picture"
                  value={formData.profile_picture || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="URL of the profile picture"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors mr-2"
              >
                Confirm
              </button>
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
