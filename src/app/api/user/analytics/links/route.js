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

// GET /api/user/analytics/links?username=...
// Returns top-10 links sorted by click count
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ error: "username is required" }, { status: 400 });
        }

        const collection = await connectToDb();

        const topLinks = await collection.aggregate([
            { $match: { username, type: "click", linkTitle: { $ne: null } } },
            { $group: { _id: "$linkTitle", clicks: { $sum: 1 } } },
            { $sort: { clicks: -1 } },
            { $limit: 10 },
            { $project: { _id: 0, title: "$_id", clicks: 1 } },
        ]).toArray();

        return NextResponse.json(topLinks, { status: 200 });
    } catch (err) {
        console.error("Analytics links error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
