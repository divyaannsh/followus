import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
let cachedClient = null;
let cachedDb = null;

async function connectToDb() {
    if (cachedClient && cachedDb) return cachedDb.collection("LinkManager01");
    const client = await MongoClient.connect(uri);
    const db = client.db("LinkManager");
    cachedClient = client;
    cachedDb = db;
    return db.collection("LinkManager01");
}

// PATCH /api/user/socialLinks/pin
// Body: { id, isPinned }
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, isPinned } = body;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Valid ID is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isPinned: Boolean(isPinned) } }
        );

        return NextResponse.json({ message: "Pin status updated successfully" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
