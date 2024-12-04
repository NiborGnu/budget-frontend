import React from "react";
import { useUserProfile } from "../hooks/useUserProfile";
import LoadingIndicator from "../components/LoadingIndicator";

const UserProfile = () => {
  const { data, isLoading, error } = useUserProfile();

  if (isLoading) {
    return (
      <div>
        Loading Profile...
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return <p>Error loading profile: {error.message}</p>;
  }

  if (!data) {
    return <p>No user profile data available.</p>; // Handling null or undefined data
  }

  const { first_name, last_name, username, created_at, updated_at } = data;

  return (
    <div>
      <h1>
        {first_name} {last_name}
      </h1>
      <p>Username: {username}</p>
      <p>
        Created At: {created_at ? new Date(created_at).toLocaleString() : "N/A"}
      </p>
      <p>
        Updated At: {updated_at ? new Date(updated_at).toLocaleString() : "N/A"}
      </p>
    </div>
  );
};

export default UserProfile;
