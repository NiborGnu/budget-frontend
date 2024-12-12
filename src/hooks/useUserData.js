import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

// General fetch function for various endpoints
const fetchData = async (endpoint) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token found");
  }

  const { data } = await apiClient.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Custom hook for fetching different types of data
export const useUserData = ({
  endpoint,
  staleTime = 300000,
  cacheTime = 600000,
}) => {
  return useQuery({
    queryKey: [endpoint], // Unique key for each query based on the endpoint
    queryFn: () => fetchData(endpoint), // Dynamic endpoint passed to the fetch function
    staleTime, // Cache data for a specific time
    cacheTime, // Retain cache for a specific time
    onError: (error) => {
      console.error(`Error fetching data from ${endpoint}:`, error);
    },
  });
};
