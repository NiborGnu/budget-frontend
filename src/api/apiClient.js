import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 responses (when access token is expired)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if the error is related to token expiration (401 Unauthorized)
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      // If no refresh token exists, reject the promise
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh the access token using the refresh token
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        // Save the new access token to localStorage
        const newAccessToken = response.data.access;
        localStorage.setItem("access_token", newAccessToken);

        // Update the Authorization header with the new access token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new access token
        return axios(error.config);
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token is invalid), redirect to login or handle accordingly
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
