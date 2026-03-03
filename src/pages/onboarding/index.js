import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";

const CATEGORIES = [
    { id: "creator", label: "Content Creator", emoji: "🎬" },
    { id: "business", label: "Business", emoji: "💼" },
    { id: "music", label: "Music & Artist", emoji: "🎵" },
    { id: "podcast", label: "Podcaster", emoji: "🎙️" },
    { id: "blogger", label: "Blogger / Writer", emoji: "✍️" },
    { id: "influencer", label: "Influencer", emoji: "⭐" },
    { id: "nonprofit", label: "Non-profit", emoji: "💙" },
    { id: "other", label: "Other", emoji: "🌐" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const username = useSelector((state) => state.auth.user);
    const [step, setStep] = useState(1);
    const [category, setCategory] = useState(null);
    const [linkTitle, setLinkTitle] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [savingLink, setSavingLink] = useState(false);

    const handleCategorySelect = (id) => {
        setCategory(id);
    };

    const handleAddLink = async () => {
        if (!linkTitle.trim() || !linkUrl.trim()) {
            toast.error("Please fill in both title and URL");
            return;
        }
        setSavingLink(true);
        try {
            await axios.post("/api/user/socialLinks", {
                title: linkTitle,
                url: linkUrl,
                username,
                isVisible: true,
            });
            toast.success("Link added! 🎉");
            setStep(3);
        } catch {
            toast.error("Failed to add link. Please try again.");
        } finally {
            setSavingLink(false);
        }
    };

    const handleFinish = () => {
        router.push("/template");
    };

    const handleSkip = () => {
        if (step === 2) setStep(3);
        else router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1.5 bg-gray-100">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="p-8">
                    {/* Step Indicator */}
                    <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-2">
                        Step {step} of 3
                    </p>

                    {/* ── STEP 1: Pick a Category ── */}
                    {step === 1 && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, @{username}! 👋</h1>
                            <p className="text-gray-500 text-sm mb-6">What best describes you? We'll personalise your experience.</p>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-left ${category === cat.id
                                                ? "border-indigo-500 bg-indigo-50 shadow-md"
                                                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <span className="text-2xl">{cat.emoji}</span>
                                        <span className="text-xs font-medium text-gray-700 text-center">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!category}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-40 hover:opacity-90 transition-all shadow-lg"
                            >
                                Continue →
                            </button>
                        </>
                    )}

                    {/* ── STEP 2: Add First Link ── */}
                    {step === 2 && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Add your first link 🔗</h1>
                            <p className="text-gray-500 text-sm mb-6">Share your website, portfolio, or social profile.</p>
                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={linkTitle}
                                        onChange={(e) => setLinkTitle(e.target.value)}
                                        placeholder="e.g. My Portfolio"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                    <input
                                        type="url"
                                        value={linkUrl}
                                        onChange={(e) => setLinkUrl(e.target.value)}
                                        placeholder="https://yoursite.com"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddLink}
                                    disabled={savingLink}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-40 hover:opacity-90 transition-all shadow-lg"
                                >
                                    {savingLink ? "Saving..." : "Add Link →"}
                                </button>
                                <button
                                    onClick={handleSkip}
                                    className="px-5 py-3 text-gray-500 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all"
                                >
                                    Skip
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── STEP 3: Choose a Theme ── */}
                    {step === 3 && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">Pick a theme 🎨</h1>
                            <p className="text-gray-500 text-sm mb-6">Make your profile stand out with a beautiful design.</p>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[
                                    { name: "Classic", bg: "from-gray-800 to-gray-900", text: "#fff" },
                                    { name: "Sunset", bg: "from-orange-400 to-pink-500", text: "#fff" },
                                    { name: "Ocean", bg: "from-cyan-400 to-blue-600", text: "#fff" },
                                ].map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={handleFinish}
                                        className={`bg-gradient-to-br ${theme.bg} rounded-2xl h-32 flex flex-col items-center justify-end p-3 hover:scale-105 transition-all shadow-md`}
                                    >
                                        <span className="text-xs font-bold text-white">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleFinish}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
                                >
                                    Browse All Themes →
                                </button>
                                <button
                                    onClick={() => router.push("/admin")}
                                    className="px-5 py-3 text-gray-500 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all"
                                >
                                    Skip
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Followus branding */}
                <div className="pb-6 text-center">
                    <p className="text-xs text-gray-400">Powered by <span className="font-semibold text-indigo-500">followus.link</span></p>
                </div>
            </div>
        </div>
    );
}
