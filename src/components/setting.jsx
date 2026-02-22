import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import PagesList from "@/components/common/pagesList";
import { User, Mail, KeyRound, Shield, AlertTriangle, Save } from "lucide-react";

export default function Setting() {
    const username = useSelector((state) => state.auth.user);
    const [userDetails, setUserDetails] = useState(null);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        if (username) fetchUserDetails();
    }, [username]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await axiosInstance.put(`/api/auth/signup`, {
                _id: userDetails._id,
                password: passwords.newPassword,
            });
            toast.success("Password updated successfully!");
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error("Failed to update password");
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
            <PagesList />

            <div className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your account preferences</p>
                    </div>

                    {/* Account Info Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <User size={20} className="text-indigo-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1.5">Username</label>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                    <User size={18} className="text-gray-400" />
                                    <span className="text-gray-700 font-medium">{userDetails?.username || "Loading..."}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1.5">Email</label>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                    <Mail size={18} className="text-gray-400" />
                                    <span className="text-gray-700 font-medium">{userDetails?.email || "Loading..."}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <KeyRound size={20} className="text-indigo-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1.5">Current Password</label>
                                <div className="relative">
                                    <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1.5">New Password</label>
                                <div className="relative">
                                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <Save size={18} />
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} className="text-red-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-2.5 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all text-sm"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                <p className="text-sm text-red-700 font-medium mb-3">Are you sure you want to delete your account?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            toast.info("Account deletion is not yet implemented.");
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="px-5 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all text-sm"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-5 py-2 bg-white text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-all text-sm border border-gray-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}