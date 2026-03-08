import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import axios from "axios";
import PagesList from "@/components/common/pagesList";
import { User, Mail, KeyRound, Shield, AlertTriangle, Save, Globe, CheckCircle, Moon, Sun } from "lucide-react";
import { toggleTheme } from "@/redux/slices/themeSlice";

export default function Setting() {
    const username = useSelector((state) => state.auth.user);
    const themeMode = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState(null);
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [customDomain, setCustomDomain] = useState("");
    const [domainSaving, setDomainSaving] = useState(false);

    const isDark = themeMode === "dark";

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

    useEffect(() => {
        const fetchDomain = async () => {
            try {
                const res = await axios.get(`/api/user/profile/domain?username=${username}`);
                setCustomDomain(res.data?.customDomain || "");
            } catch { /* ignore */ }
        };
        if (username) fetchDomain();
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

    const handleSaveDomain = async (e) => {
        e.preventDefault();
        setDomainSaving(true);
        try {
            await axios.patch("/api/user/profile/domain", { username, customDomain: customDomain.trim() });
            toast.success("Custom domain saved!");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to save domain");
        } finally {
            setDomainSaving(false);
        }
    };

    const bgStyle = isDark
        ? { background: "linear-gradient(135deg,#0f0c29 0%,#1e1b4b 100%)" }
        : { background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)" };
    const cardCls = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
    const headingCls = isDark ? "text-gray-100" : "text-gray-900";
    const labelCls = isDark ? "text-gray-400" : "text-gray-500";
    const inputCls = isDark
        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400"
        : "border-gray-200 text-gray-700 placeholder-gray-400 focus:border-indigo-400";

    return (
        <div className="flex min-h-screen" style={bgStyle}>
            <PagesList />

            <div className="flex-1 px-6 py-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className={`text-3xl font-bold ${headingCls}`}>Settings</h1>
                        <p className={`mt-1 ${labelCls}`}>Manage your account preferences</p>
                    </div>

                    {/* Appearance: Dark / Light Mode */}
                    <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${cardCls}`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isDark ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-indigo-500" />}
                                <h2 className={`text-lg font-semibold ${headingCls}`}>Theme</h2>
                            </div>
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isDark ? "bg-indigo-500" : "bg-gray-200"}`}
                                title="Toggle dark/light mode"
                            >
                                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${isDark ? "left-8" : "left-1"}`} />
                                <span className="sr-only">{isDark ? "Switch to light" : "Switch to dark"}</span>
                            </button>
                        </div>
                        <p className={`text-sm mt-3 ${labelCls}`}>
                            Currently using <strong>{isDark ? "dark" : "light"}</strong> mode. The theme applies across the entire admin dashboard.
                        </p>
                    </div>

                    {/* Account Info Card */}
                    <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${cardCls}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <User size={20} className="text-indigo-500" />
                            <h2 className={`text-lg font-semibold ${headingCls}`}>Account Information</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Username</label>
                                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
                                    <User size={18} className={labelCls} />
                                    <span className={`font-medium ${headingCls}`}>{userDetails?.username || "Loading..."}</span>
                                    {userDetails?.isVerified && (
                                        <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-blue-500">
                                            <CheckCircle size={14} /> Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Email</label>
                                <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${isDark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
                                    <Mail size={18} className={labelCls} />
                                    <span className={`font-medium ${headingCls}`}>{userDetails?.email || "Loading..."}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${cardCls}`}>
                        <div className="flex items-center gap-2 mb-6">
                            <KeyRound size={20} className="text-indigo-500" />
                            <h2 className={`text-lg font-semibold ${headingCls}`}>Change Password</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Current Password</label>
                                <div className="relative">
                                    <Shield size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${labelCls}`} />
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        placeholder="Enter current password"
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all ${inputCls}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>New Password</label>
                                <div className="relative">
                                    <KeyRound size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${labelCls}`} />
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="Enter new password"
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all ${inputCls}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${labelCls}`}>Confirm New Password</label>
                                <div className="relative">
                                    <KeyRound size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${labelCls}`} />
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        placeholder="Confirm new password"
                                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all ${inputCls}`}
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

                    {/* Custom Domain Card */}
                    <div className={`rounded-2xl shadow-sm border p-6 mb-6 ${cardCls}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Globe size={20} className="text-indigo-500" />
                            <h2 className={`text-lg font-semibold ${headingCls}`}>Custom Domain</h2>
                        </div>
                        <p className={`text-sm mb-4 ${labelCls}`}>
                            Point your own domain to your Followus profile. Enter your domain below, then follow the DNS setup instructions.
                        </p>

                        <form onSubmit={handleSaveDomain} className="space-y-4">
                            <div className="relative">
                                <Globe size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${labelCls}`} />
                                <input
                                    type="text"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    placeholder="links.yourbrand.com"
                                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all ${inputCls}`}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={domainSaving}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {domainSaving ? "Saving..." : <><Save size={18} /> Save Domain</>}
                            </button>
                        </form>

                        {/* DNS Instructions */}
                        <div className={`mt-5 rounded-xl p-4 border text-sm ${isDark ? "bg-gray-700/60 border-gray-600" : "bg-indigo-50 border-indigo-100"}`}>
                            <p className={`font-semibold mb-2 ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>🌐 DNS Setup Instructions</p>
                            <ol className={`space-y-1 list-decimal list-inside text-xs ${isDark ? "text-gray-300" : "text-indigo-700"}`}>
                                <li>Go to your DNS provider (e.g. Namecheap, Cloudflare, GoDaddy)</li>
                                <li>Create a <strong>CNAME</strong> record for your subdomain (e.g. <code>links</code>)</li>
                                <li>Point it to: <code className="font-mono bg-white/30 px-1 rounded">cname.followus.link</code></li>
                                <li>Wait up to 48 hours for DNS propagation</li>
                                <li>Come back here and save your domain</li>
                            </ol>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className={`rounded-2xl shadow-sm border border-red-200 p-6 ${isDark ? "bg-gray-800" : "bg-white"}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={20} className="text-red-500" />
                            <h2 className={`text-lg font-semibold ${headingCls}`}>Danger Zone</h2>
                        </div>
                        <p className={`text-sm mb-4 ${labelCls}`}>
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