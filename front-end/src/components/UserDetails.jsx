import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useAdmin } from "../contexts/AdminContext";
import { useParams, useNavigate } from "react-router-dom";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, error, fetchUserById } = useUser();
  const { bannedUsers, banUser, unbanUser } = useAdmin(); // Track banned users
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserById(id);
  }, [id, fetchUserById]);

  const isBanned = user?.isBanned || bannedUsers.includes(id);

  const handleBanUser = async () => {
    setActionLoading(true);
    try {
      await banUser(id);
      await fetchUserById(id); // ✅ Ensure updated user state
    } catch (err) {
      console.error("Ban failed:", err);
    }
    setActionLoading(false);
  };
  
  const handleUnbanUser = async () => {
    setActionLoading(true);
    try {
      await unbanUser(id);
      await fetchUserById(id); // ✅ Ensure updated user state
    } catch (err) {
      console.error("Unban failed:", err);
    }
    setActionLoading(false);
  };
  

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-700 hover:text-gray-900 transition duration-200"
      >
        <span className="mr-2">←</span> Back
      </button>

      {loading && <p className="text-center text-gray-600">Loading user details...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {user && (
        <div className="text-center">
          {/* Profile Picture */}
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt={user.fullName}
            className="w-28 h-28 mx-auto rounded-full border-2 border-gray-300 object-cover"
          />

          <h2 className="text-2xl font-bold mt-4">{user.fullName}</h2>
          <p className="text-gray-600 capitalize">{user.role}</p>

          {/* Additional User Details */}
          <div className="mt-6 text-left space-y-2">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNumber || "N/A"}</p>
            <p><strong>Gender:</strong> {user.gender || "Not specified"}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
            <p>
              <strong>Address:</strong> 
              {user.address?.city || "N/A"}, {user.address?.state || "N/A"}, {user.address?.country || "N/A"}
            </p>
          </div>

          {/* Ban/Unban Buttons */}
          <div className="mt-6">
            {isBanned ? (
              <button
                onClick={handleUnbanUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Unbanning..." : "Unban User"}
              </button>
            ) : (
              <button
                onClick={handleBanUser}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading ? "Banning..." : "Ban User"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
