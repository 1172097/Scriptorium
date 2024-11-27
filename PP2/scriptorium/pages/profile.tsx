import React, { useEffect, useState } from "react";
import { api } from "@/utils/api"; // Adjust the import path as needed

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userData = await api.get("/auth/profile");
        setUser(userData.user);
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile">
      <h1>User Profile</h1>
      {user ? (
        <div>
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
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default UserProfile;
