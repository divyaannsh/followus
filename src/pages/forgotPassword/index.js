import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import Link from "next/link";
import Image from "next/image";
import { KeyRound, Mail, User, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
    const username = useSelector((state) => state.auth.user);
    const [userDetails, setUserDetails] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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
        if (!password) {
            toast.error("Please enter a new password.");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await axiosInstance.put(`/api/auth/signup`, {
                _id: userDetails._id,
                password,
            });

            toast.success("Password updated successfully!");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error("Failed to update password");
            console.error("Error updating password:", error);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Panel - Form */}
            <div className="w-full md:w-1/2 bg-[#1a1a2e] text-white flex flex-col justify-center px-8 md:px-16">
                <Link href="/login" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm">
                    <ArrowLeft size={16} />
                    Back to login
                </Link>

                <div className="mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                        <KeyRound size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
                    <p className="text-gray-400">Enter your new password below</p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-5">
                    {/* Username (read-only) */}
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-medium">Username</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={userDetails?.username || ""}
                                disabled
                                className="w-full pl-12 pr-4 py-3.5 bg-[#16213e] border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-medium">Email</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="email"
                                value={userDetails?.email || ""}
                                disabled
                                className="w-full pl-12 pr-4 py-3.5 bg-[#16213e] border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-medium">New Password</label>
                        <div className="relative">
                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-[#16213e] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block font-medium">Confirm Password</label>
                        <div className="relative">
                            <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-[#16213e] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.99]"
                    >
                        Reset Password
                    </button>
                </form>

                <p className="text-xs text-gray-600 mt-10">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <Link href="#" className="underline hover:text-gray-400">Privacy Policy</Link> and{" "}
                    <Link href="#" className="underline hover:text-gray-400">Terms of Service</Link> apply.
                </p>
            </div>

            {/* Right Panel - Image */}
            <div className="hidden md:block md:w-1/2">
                <img src="/img/loginImage.jpg" alt="Reset Password" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default ForgotPassword;
