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

// PATCH /api/user/profile/verify
// Body: { username, isVerified }
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { username, isVerified } = body;

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        await collection.updateOne(
            { username },
            { $set: { isVerified: Boolean(isVerified) } }
        );

        return NextResponse.json({ message: "Verification status updated" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// GET /api/user/profile/verify?username=xxx
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const user = await collection.findOne({ username }, { projection: { isVerified: 1 } });

        return NextResponse.json({ isVerified: user?.isVerified || false });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
