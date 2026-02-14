import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import Header from "@/components/home/header";
import Footer from "@/components/common/footer";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "utils/axiosInstance";

const ProfileDetails = () => {
  const username = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "********", // Masked password,
    profileName: "",
    Plan: "Free",
    profileImage: "/default-avatar.png", // Default avatar image
  });

  // Fetch User Profile
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(`/api/auth/signup?username=${username}`);
      console.log("response", response);

      if (response.data.length > 0) {
        setUserData({
          username: response.data[0].username,
          email: response.data[0].email,
          profileName: response.data[0].profileName,
          password: "********", // Always keep it masked
          Plan: "Free", // Always keep it masked
          profileImage: response.data[0].profileImage || "/default-avatar.png",
        });
      }
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  return (
    <>
      <Header />
      <div className="container mx-auto p-6 mt-20 flex flex-col items-center">
        {/* Profile Image */}
        <Avatar
          src={userData.profileImage}
          alt="Profile Image"
          className="w-24 h-24 mb-4"
        />

        {/* Profile Name */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">{userData.username}</h2>

        <div className="w-full max-w-md">
          {["username", "email", "profileName", "Plan", "password"].map((key) => (
            <div key={key} className="flex justify-between items-center py-3 border-b">
              <div>
                <label className="block text-gray-600 capitalize">{key}</label>
                <p className="text-gray-700">{userData[key]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfileDetails;
