import { useQueryClient } from "@tanstack/react-query";

// Custom hook to clear user profile cache
export const useClearUserProfileCache = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries(["userProfile"]); // Clear cache for user profile
  };
};
