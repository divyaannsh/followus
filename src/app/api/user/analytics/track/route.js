import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
let cachedClient = null;
let cachedDb = null;

async function connectToDb() {
    if (cachedClient && cachedDb) return cachedDb.collection("events");
    const client = await MongoClient.connect(uri);
    const db = client.db("analytics");
    cachedClient = client;
    cachedDb = db;
    return db.collection("events");
}

/**
 * Detect traffic source from referrer string or ?ref= query param.
 */
function detectSource(refHeader, refParam) {
    const ref = (refParam || refHeader || "").toLowerCase();
    if (!ref) return "direct";
    if (ref.includes("instagram")) return "instagram";
    if (ref.includes("facebook") || ref.includes("fb.com") || ref.includes("fb.me")) return "facebook";
    if (ref.includes("twitter") || ref.includes("t.co") || ref.includes("x.com")) return "twitter";
    if (ref.includes("whatsapp") || ref.includes("wa.me")) return "whatsapp";
    if (ref.includes("youtube") || ref.includes("youtu.be")) return "youtube";
    if (ref.includes("linkedin")) return "linkedin";
    if (ref.includes("tiktok")) return "tiktok";
    if (ref.includes("snapchat")) return "snapchat";
    if (ref.includes("pinterest")) return "pinterest";
    return "other";
}

/**
 * Detect device type from User-Agent header.
 * Returns "android" | "ios" | "web"
 */
function detectDevice(userAgent = "") {
    const ua = userAgent.toLowerCase();
    if (ua.includes("android")) return "android";
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "ios";
    return "web";
}

// POST /api/user/analytics/track
export async function POST(req) {
    try {
        const body = await req.json();
        const { username, type, linkId, linkTitle, referrer: refParam } = body;

        if (!username || !type) {
            return NextResponse.json({ error: "username and type are required" }, { status: 400 });
        }

        const refHeader = req.headers.get("referer") || "";
        const userAgent = req.headers.get("user-agent") || "";
        const source = detectSource(refHeader, refParam);
        const device = detectDevice(userAgent);

        const collection = await connectToDb();
        await collection.insertOne({
            username,
            type,            // "click" | "view"
            linkId: linkId || null,
            linkTitle: linkTitle || null,
            source,
            device,          // "android" | "ios" | "web"
            timestamp: new Date(),
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err) {
        console.error("Analytics track error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
