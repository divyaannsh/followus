import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { faInstagram, faFacebook, faXTwitter, faYoutube, faWhatsapp, faLinkedin, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SOCIAL_ICONS = {
    Instalink: faInstagram,
    Fblink: faFacebook,
    Twitlink: faXTwitter,
    youtube: faYoutube,
    whatsapp: faWhatsapp,
    linkedin: faLinkedin,
    tiktok: faTiktok,
};

export default function PublicProfile() {
    const router = useRouter();
    const { username } = router.query;
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Detect referrer source from URL ?ref= param or document.referrer
    const getSource = () => {
        if (typeof window === "undefined") return "direct";
        const params = new URLSearchParams(window.location.search);
        const refParam = params.get("ref") || params.get("utm_source") || "";
        const refHeader = document.referrer || "";

        // Same-domain referrer (e.g. navigating from /admin) = direct
        if (!refParam && refHeader) {
            try {
                const refHost = new URL(refHeader).hostname;
                if (refHost === window.location.hostname) return "direct";
            } catch { /* ignore */ }
        }

        const ref = (refParam + refHeader).toLowerCase();
        if (!ref) return "direct";
        if (ref.includes("instagram")) return "instagram";
        if (ref.includes("facebook") || ref.includes("fb.")) return "facebook";
        if (ref.includes("twitter") || ref.includes("t.co") || ref.includes("x.com")) return "twitter";
        if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
        if (ref.includes("youtube") || ref.includes("youtu.be")) return "youtube";
        if (ref.includes("linkedin")) return "linkedin";
        if (ref.includes("tiktok")) return "tiktok";
        // Has an external referrer but not a known social = still direct (browser navigation)
        if (!refParam && refHeader) return "direct";
        return "other";
    };

    const trackEvent = useCallback(async (type, link = null) => {
        if (!username) return;
        try {
            await axios.post("/api/user/analytics/track", {
                username,
                type,
                linkId: link?._id || null,
                linkTitle: link?.title || null,
                referrer: getSource(),
            });
        } catch {
            // fail silently — never block user navigation
        }
    }, [username]);

    useEffect(() => {
        if (!username) return;
        const fetchAll = async () => {
            try {
                const [profileRes, linksRes, templateRes] = await Promise.all([
                    axios.get(`/api/auth/signup?username=${username}`).catch(() => null),
                    axios.get(`/api/user/socialLinks?username=${username}`).catch(() => null),
                    axios.get(`/api/user/template/chooseTemplate?username=${username}`).catch(() => null),
                ]);

                if (!profileRes?.data?.[0]) {
                    setNotFound(true);
                    return;
                }
                setProfile(profileRes.data[0]);
                setLinks((linksRes?.data || []).filter((l) => l.isVisible));
                setTemplate(templateRes?.data?.data?.[0] || null);

                // Track profile view
                trackEvent("view");
            } catch {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [username, trackEvent]);

    const handleLinkClick = (link, e) => {
        e.preventDefault();
        const url = link.url.startsWith("http") ? link.url : `https://${link.url}`;
        // Navigate immediately — don't await tracking (popup blockers block window.open after async)
        window.location.href = url;
        // Track click in background without blocking navigation
        trackEvent("click", link);
    };

    const handleCopy = (link) => {
        const url = link.url.startsWith("http") ? link.url : `https://${link.url}`;
        navigator.clipboard.writeText(url).catch(() => { });
        setCopiedId(link._id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const socialKeys = ["Instalink", "Fblink", "Twitlink", "youtube", "whatsapp", "linkedin"];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <h1 className="text-white text-3xl font-bold">404</h1>
                <p className="text-white/80">Profile not found</p>
            </div>
        );
    }

    const bg = darkMode
        ? "linear-gradient(135deg,#0f0c29,#302b63,#24243e)"
        : (template?.bgcolor || "linear-gradient(135deg,#6366f1,#8b5cf6)");
    const textColor = darkMode ? "#e2e8f0" : (template?.color || "#ffffff");
    const avatar = profile?.profileImage ||
        "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg";

    return (
        <div
            className="min-h-screen flex flex-col items-center py-12 px-4 relative"
            style={{ background: bg }}
        >
            {/* Dark/Light Mode Toggle */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg transition-all border border-white/20 backdrop-blur-sm"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="w-full max-w-sm flex flex-col items-center gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                    <Image src={avatar} alt={profile?.username || "Avatar"} width={96} height={96} className="object-cover w-full h-full" />
                </div>

                {/* Name & Bio */}
                <div className="text-center">
                    <h1 className="text-xl font-bold" style={{ color: textColor }}>
                        @{profile?.username}
                    </h1>
                    {profile?.Bio && (
                        <p className="text-sm mt-1 opacity-80" style={{ color: textColor }}>
                            {profile.Bio}
                        </p>
                    )}
                </div>

                {/* Social Icons */}
                <div className="flex gap-3">
                    {socialKeys.map((key) => {
                        const url = key === "whatsapp"
                            ? (profile?.whatsAppLink ? `https://wa.me/${profile.whatsAppLink}` : null)
                            : profile?.[key];
                        if (!url || !SOCIAL_ICONS[key]) return null;
                        return (
                            <a
                                key={key}
                                href={url.startsWith("http") ? url : `https://${url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center hover:bg-white/25 transition-all"
                            >
                                <FontAwesomeIcon icon={SOCIAL_ICONS[key]} className="w-4 h-4" style={{ color: textColor }} />
                            </a>
                        );
                    })}
                </div>

                {/* Links */}
                <div className="w-full space-y-3">
                    {links.map((link) => {
                        let faviconUrl = null;
                        try {
                            const domain = new URL(link.url.startsWith("http") ? link.url : `https://${link.url}`).hostname;
                            faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
                        } catch { /* ignore */ }

                        const isCopied = copiedId === link._id;

                        return (
                            <div key={link._id} className="relative group">
                                <a
                                    href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                                    onClick={(e) => handleLinkClick(link, e)}
                                    rel="noopener noreferrer"
                                    className="w-full py-3 px-5 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-center font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 hover:shadow-lg"
                                    style={{ color: textColor }}
                                >
                                    {faviconUrl && (
                                        <img
                                            src={faviconUrl}
                                            alt=""
                                            width={16}
                                            height={16}
                                            className="rounded-sm shrink-0 opacity-90"
                                            onError={(e) => { e.target.style.display = "none"; }}
                                        />
                                    )}
                                    {link.title}
                                </a>
                                {/* Copy to clipboard button */}
                                <button
                                    onClick={() => handleCopy(link)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-xs transition-all opacity-0 group-hover:opacity-100"
                                    title="Copy link"
                                    style={{ color: textColor }}
                                >
                                    {isCopied ? "✓" : "⎘"}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Ad Banner */}
                <div className="w-full mt-4 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
                    <a
                        href="https://followus.link/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            fu
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold" style={{ color: textColor }}>Create your free page</p>
                            <p className="text-xs opacity-60 truncate" style={{ color: textColor }}>followus.link — Join thousands of creators</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/20 shrink-0" style={{ color: textColor }}>
                            Free →
                        </span>
                    </a>
                </div>

                {/* Footer */}
                <p className="text-xs mt-2 opacity-40" style={{ color: textColor }}>
                    Powered by Followus
                </p>
            </div>
        </div>
    );
}
