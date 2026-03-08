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

export async function POST(req) {
    try {
        const body = await req.json();
        const { url, username, title, isVisible, scheduledAt, expiresAt, animation, type } = body;

        if (!url || !username || !title) {
            return new NextResponse("URL and Username are required", { status: 400 });
        }

        const collection = await connectToDb();

        // Get max current order to append at end
        const maxDoc = await collection.findOne({ username }, { sort: { order: -1 } });
        const nextOrder = maxDoc?.order != null ? maxDoc.order + 1 : 0;

        const result = await collection.insertOne({
            url,
            username,
            title,
            isVisible,
            clickCount: 0,
            viewCount: 0,
            order: nextOrder,
            isPinned: false,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            animation: animation || "none",
            type: type || "link",
        });

        return NextResponse.json(
            { message: "Data added successfully!", data: result, status: 200 },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();
        const { isVisible } = body;

        if (!id) {
            return NextResponse.json({ message: 'ID is required', status: 400 });
        }

        if (typeof isVisible !== 'boolean') {
            return NextResponse.json({ message: 'isVisible must be a boolean', status: 400 });
        }

        const collection = await connectToDb();
        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isVisible } }
        );

        return NextResponse.json({ message: "Data is successfully updated!", status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");
        const isAdmin = searchParams.get("admin") === "1";

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        // Sort: pinned first, then by order
        let query = { username };

        // If not admin (public profile), filter by schedule window
        if (!isAdmin) {
            const now = new Date();
            query = {
                username,
                $or: [
                    { scheduledAt: null },
                    { scheduledAt: { $exists: false } },
                    { scheduledAt: { $lte: now } },
                ],
                $and: [
                    {
                        $or: [
                            { expiresAt: null },
                            { expiresAt: { $exists: false } },
                            { expiresAt: { $gte: now } },
                        ]
                    }
                ]
            };
        }

        const data = await collection.find(query).sort({ isPinned: -1, order: 1 }).toArray();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
        }

        const collection = await connectToDb();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "No document found with the provided ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Data deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const type = searchParams.get("type");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        if (!type || (type !== "click" && type !== "view")) {
            return NextResponse.json({ message: "Type must be 'click' or 'view'" }, { status: 400 });
        }

        const userIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
        const collection = await connectToDb();

        const profile = await collection.findOne({ _id: new ObjectId(id) });

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        if (type === "view") {
            if (!profile.viewedBy) profile.viewedBy = [];
            const alreadyViewed = profile.viewedBy.includes(userIp);
            if (!alreadyViewed) {
                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    { $inc: { viewCount: 1 }, $push: { viewedBy: userIp } }
                );
            }
        }

        if (type === "click") {
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $inc: { clickCount: 1 } }
            );
        }

        return NextResponse.json({ message: `${type} count updated successfully!` });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
