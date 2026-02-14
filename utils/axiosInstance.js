import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://www.followus.link",
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosInstance;
