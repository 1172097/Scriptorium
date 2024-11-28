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
    return <p className="text-center text-error">Error: {error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-[var(--card-background)] rounded-2xl shadow-lg p-6 relative">
      <h1 className="text-2xl font-bold mb-6 text-heading">User Profile</h1>
      {user ? (
        <div className="space-y-4">
          {!editing ? (
            <>
              <p className="text-body">
                <strong>Username:</strong> {user.username}
              </p>
              <p className="text-body">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-body">
                <strong>First Name:</strong> {user.first_name || "N/A"}
              </p>
              <p className="text-body">
                <strong>Last Name:</strong> {user.last_name || "N/A"}
              </p>
              <p className="text-body">
                <strong>Phone:</strong> {user.phone || "N/A"}
              </p>
              <p className="text-body">
                <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
              </p>
              <p className="text-body">
                <strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}
              </p>
              <button
                onClick={handleEditToggle}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Profile Picture</label>
                <input
                  type="text"
                  name="profile_picture"
                  value={formData.profile_picture || ""}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="URL of the profile picture"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  className="btn-success"
                >
                  Confirm
                </button>
                <button
                  onClick={handleEditToggle}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-body">No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
