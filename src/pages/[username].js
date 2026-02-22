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

    // Detect referrer source from URL ?ref= param or document.referrer
    const getSource = () => {
        if (typeof window === "undefined") return "direct";
        const params = new URLSearchParams(window.location.search);
        const refParam = params.get("ref") || params.get("utm_source") || "";
        const refHeader = document.referrer || "";
        const ref = (refParam + refHeader).toLowerCase();
        if (!ref) return "direct";
        if (ref.includes("instagram")) return "instagram";
        if (ref.includes("facebook") || ref.includes("fb.")) return "facebook";
        if (ref.includes("twitter") || ref.includes("t.co") || ref.includes("x.com")) return "twitter";
        if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
        if (ref.includes("youtube") || ref.includes("youtu.be")) return "youtube";
        if (ref.includes("linkedin")) return "linkedin";
        if (ref.includes("tiktok")) return "tiktok";
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

    const handleLinkClick = async (link, e) => {
        e.preventDefault();
        await trackEvent("click", link);
        const url = link.url.startsWith("http") ? link.url : `https://${link.url}`;
        window.open(url, "_blank", "noopener,noreferrer");
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

    const bg = template?.bgcolor || "linear-gradient(135deg,#6366f1,#8b5cf6)";
    const textColor = template?.color || "#ffffff";
    const avatar = profile?.profileImage ||
        "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg";

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ background: bg }}
        >
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
                    {links.map((link) => (
                        <a
                            key={link._id}
                            href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                            onClick={(e) => handleLinkClick(link, e)}
                            rel="noopener noreferrer"
                            className="w-full py-3 px-6 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-center font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] block"
                            style={{ color: textColor }}
                        >
                            {link.title}
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-xs mt-4 opacity-40" style={{ color: textColor }}>
                    Powered by Followus
                </p>
            </div>
        </div>
    );
}
