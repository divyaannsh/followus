import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
let cachedClient = null;
let cachedDb = null;

async function connectToDb() {
    if (cachedClient && cachedDb) return cachedDb.collection("shortlinks");
    const client = await MongoClient.connect(uri);
    const db = client.db("LinkManager");
    cachedClient = client;
    cachedDb = db;
    return db.collection("shortlinks");
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = (searchParams.get("slug") || "").trim().toLowerCase();

        if (!slug) {
            return NextResponse.json({ message: "slug is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const shortLink = await collection.findOne({ slug });

        if (!shortLink) {
            return NextResponse.json({ message: "Short link not found" }, { status: 404 });
        }

        await collection.updateOne({ slug }, { $inc: { clickCount: 1 } });

        return NextResponse.json({ originalUrl: shortLink.originalUrl }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
