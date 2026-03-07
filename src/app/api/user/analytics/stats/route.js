import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
const client = uri ? new MongoClient(uri) : null;

async function connectToDb() {
    if (!client) throw new Error("MongoDB client not initialized. Check MONGO_URI.");
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db("analytics").collection("events");
}

function getDaysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
}

// GET /api/user/analytics/stats?username=xxx&days=30
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const days = parseInt(searchParams.get("days") || "30", 10);

        if (!username) {
            return NextResponse.json({ error: "username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const since = getDaysAgo(days === 0 ? 3650 : days); // 0 = all-time (10 years)

        const filter = { username, timestamp: { $gte: since } };

        // Fetch all events in date range
        const events = await collection.find(filter).toArray();

        // ── Totals ──
        const views = events.filter(e => e.type === "view");
        const clicks = events.filter(e => e.type === "click");
        const totalViews = views.length;
        const totalClicks = clicks.length;
        const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

        // ── Top Links ──
        const linkMap = {};
        for (const e of clicks) {
            const key = e.linkId || "unknown";
            if (!linkMap[key]) linkMap[key] = { linkId: e.linkId, title: e.linkTitle || "Untitled", clicks: 0 };
            linkMap[key].clicks++;
        }
        const topLinks = Object.values(linkMap).sort((a, b) => b.clicks - a.clicks).slice(0, 10);
        const topLink = topLinks[0]?.title || "–";

        // ── Traffic Sources ──
        const sourceMap = {};
        for (const e of events) {
            const s = e.source || "direct";
            sourceMap[s] = (sourceMap[s] || 0) + 1;
        }
        const trafficSources = Object.entries(sourceMap)
            .map(([source, count]) => ({ source, count }))
            .sort((a, b) => b.count - a.count);

        // ── Daily Breakdown (last N days) ──
        const dailyMap = {};
        for (let i = 0; i < Math.min(days || 30, 90); i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            dailyMap[key] = { date: key, views: 0, clicks: 0 };
        }
        for (const e of events) {
            const key = new Date(e.timestamp).toISOString().slice(0, 10);
            if (dailyMap[key]) {
                if (e.type === "view") dailyMap[key].views++;
                if (e.type === "click") dailyMap[key].clicks++;
            }
        }
        const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

        // ── Device Breakdown ──
        const deviceMap = { android: 0, ios: 0, web: 0 };
        for (const e of events) {
            const d = e.device || "web";
            deviceMap[d] = (deviceMap[d] || 0) + 1;
        }
        const deviceBreakdown = [
            { device: "android", label: "Android", count: deviceMap.android, color: "#3ddc84", emoji: "🤖" },
            { device: "ios", label: "iOS", count: deviceMap.ios, color: "#007aff", emoji: "🍎" },
            { device: "web", label: "Web", count: deviceMap.web, color: "#6366f1", emoji: "🖥️" },
        ].filter(d => d.count > 0);

        return NextResponse.json({
            totalViews,
            totalClicks,
            clickRate,
            topLink,
            topLinks,
            trafficSources,
            daily,
            deviceBreakdown,
        });
    } catch (err) {
        console.error("Analytics stats error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
