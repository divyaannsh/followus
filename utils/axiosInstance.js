import axios from "axios";

// Use relative URL on the client to avoid CORS and port mismatches
const baseURL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.followus.link');

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
