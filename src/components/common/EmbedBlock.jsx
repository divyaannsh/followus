/**
 * EmbedBlock component
 * Renders YouTube or Spotify embeds based on link.type and link.url
 */

import { useState } from "react";
import { Play, Music } from "lucide-react";

// Extract YouTube video ID from various YouTube URL formats
function extractYouTubeId(url) {
    try {
        const u = new URL(url.startsWith("http") ? url : `https://${url}`);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        return u.searchParams.get("v") || null;
    } catch {
        return null;
    }
}

// Transform Spotify URL to embed URL
function getSpotifyEmbedUrl(url) {
    try {
        const u = new URL(url.startsWith("http") ? url : `https://${url}`);
        // https://open.spotify.com/track/ID → https://open.spotify.com/embed/track/ID
        const path = u.pathname; // e.g. /track/4uLU6hMCjMI75M1A2tKUQC
        return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
    } catch {
        return null;
    }
}

export function YouTubeEmbed({ url, title, textColor }) {
    const [expanded, setExpanded] = useState(false);
    const videoId = extractYouTubeId(url);

    if (!videoId) {
        return (
            <a
                href={url.startsWith("http") ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-center font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ color: textColor }}
            >
                <Play size={14} />
                {title}
            </a>
        );
    }

    return (
        <div className="w-full rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                style={{ color: textColor }}
            >
                <div className="w-9 h-9 bg-red-500/80 rounded-xl flex items-center justify-center shrink-0">
                    <Play size={16} className="text-white fill-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{title || "YouTube Video"}</p>
                    <p className="text-xs opacity-60">Click to {expanded ? "collapse" : "expand"}</p>
                </div>
            </button>
            {expanded && (
                <div className="px-3 pb-3">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full rounded-xl"
                        style={{ height: "180px", border: "none" }}
                        title={title || "YouTube Video"}
                    />
                </div>
            )}
        </div>
    );
}

export function SpotifyEmbed({ url, title, textColor }) {
    const [expanded, setExpanded] = useState(false);
    const embedUrl = getSpotifyEmbedUrl(url);

    if (!embedUrl) {
        return (
            <a
                href={url.startsWith("http") ? url : `https://${url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full border border-white/25 bg-white/10 hover:bg-white/25 text-center font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ color: textColor }}
            >
                <Music size={14} />
                {title}
            </a>
        );
    }

    return (
        <div className="w-full rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-all text-left"
                style={{ color: textColor }}
            >
                <div className="w-9 h-9 bg-green-500/80 rounded-xl flex items-center justify-center shrink-0">
                    <Music size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{title || "Spotify Track"}</p>
                    <p className="text-xs opacity-60">Click to {expanded ? "collapse" : "expand"}</p>
                </div>
            </button>
            {expanded && (
                <div className="px-3 pb-3">
                    <iframe
                        src={embedUrl}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="w-full rounded-xl"
                        style={{ height: "152px", border: "none" }}
                        title={title || "Spotify Track"}
                    />
                </div>
            )}
        </div>
    );
}
