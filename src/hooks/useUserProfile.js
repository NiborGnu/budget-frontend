import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

// Fetch function for user profile
const fetchUserProfile = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const { data } = await apiClient.get("/users/profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Custom hook for user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"], // Unique key for this query
    queryFn: fetchUserProfile,
    staleTime: 300000, // Cache data for 5 minutes
    cacheTime: 600000, // Retain cache for 10 minutes
    onError: (error) => {
      console.error("Error fetching user profile:", error);
    },
  });
};
