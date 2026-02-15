import Footer from "@/components/common/footer";
import Header from "@/components/home/header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";

const ForgotPassword = () => {
    const username = useSelector((state) => state.auth.user);
    const [userDetails, setUserDetails] = useState(null);
    const [password, setPassword] = useState("");

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axiosInstance.get(`/api/auth/signup?username=${username}`);
                if (response.data.length > 0) {
                    setUserDetails(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        if (username) {
            fetchUserDetails();
        }
    }, [username]);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!userDetails || !password) {
            toast.error("Please enter a new password.");
            return;
        }

        try {
            await axiosInstance.put(`/api/auth/signup`, {
                _id: userDetails._id,
                password,
            });

            toast.success("Password updated successfully");
            setPassword("");
        } catch (error) {
            toast.error("Failed to update password");
            console.error("Error updating password:", error);
        }
    };

    return (
        <>
            <Header />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">

                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Forgot Password</h2>
                    <form onSubmit={handlePasswordReset}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Username</label>
                            <input
                                type="text"
                                value={userDetails?.username || ""}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                value={userDetails?.email || ""}
                                disabled
                                className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForgotPassword;
