import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
let cachedClient = null;
let cachedDb = null;

async function connectToDb() {
    if (cachedClient && cachedDb) return cachedDb.collection("loginData");
    const client = await MongoClient.connect(uri);
    const db = client.db("LinkManager");
    cachedClient = client;
    cachedDb = db;
    return db.collection("loginData");
}

// PATCH /api/user/profile/domain
// Body: { username, customDomain }
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { username, customDomain } = body;

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        // Basic domain validation
        if (customDomain && !/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/.test(customDomain)) {
            return NextResponse.json({ message: "Invalid domain format" }, { status: 400 });
        }

        const collection = await connectToDb();
        await collection.updateOne(
            { username },
            { $set: { customDomain: customDomain || null } }
        );

        return NextResponse.json({ message: "Custom domain updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// GET /api/user/profile/domain?username=xxx
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const user = await collection.findOne({ username }, { projection: { customDomain: 1 } });

        return NextResponse.json({ customDomain: user?.customDomain || null });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
