import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ShortLinkRedirectPage() {
    const router = useRouter();
    const { slug } = router.query;
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;

        const resolveShortLink = async () => {
            try {
                const res = await axios.get(`/api/user/shortlinks/resolve?slug=${slug}`);
                const destination = res?.data?.originalUrl;
                if (!destination) {
                    throw new Error("Invalid destination URL");
                }
                window.location.replace(destination.startsWith("http") ? destination : `https://${destination}`);
            } catch {
                setError("This short link does not exist or has been removed.");
            }
        };

        resolveShortLink();
    }, [slug]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
                <h1 className="text-xl font-bold text-gray-900 mb-2">Redirecting...</h1>
                {error ? (
                    <p className="text-red-500 text-sm">{error}</p>
                ) : (
                    <p className="text-gray-500 text-sm">Please wait while we take you to your destination.</p>
                )}
            </div>
        </div>
    );
}
