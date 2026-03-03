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

// POST /api/user/socialLinks/reorder
// Body: { username: string, orderedIds: string[] }
export async function POST(req) {
    try {
        const body = await req.json();
        const { username, orderedIds } = body;

        if (!username || !Array.isArray(orderedIds)) {
            return NextResponse.json({ message: "username and orderedIds[] are required" }, { status: 400 });
        }

        const collection = await connectToDb();

        // Update each link with its new order index
        const updates = orderedIds.map((id, index) =>
            collection.updateOne(
                { _id: new ObjectId(id), username },
                { $set: { order: index } }
            )
        );
        await Promise.all(updates);

        return NextResponse.json({ message: "Order saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Reorder error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
