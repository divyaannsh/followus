import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = () => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
      <CircularProgress size={60} color="primary" />
    </div>
  );
};

export default LoadingSpinner;
