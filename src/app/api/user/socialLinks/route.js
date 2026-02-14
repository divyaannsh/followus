import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = "LinkManager";
const collectionName = "LinkManager01";

async function connectToDb() {
    await client.connect();
    const database = client.db(dbName);
    return database.collection(collectionName);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { url, username, title, isVisible } = body;

        if (!url || !username || !title) {
            return new NextResponse("URL and Username are required", { status: 400 });
        }

        const collection = await connectToDb();
        const result = await collection.insertOne({ url, username, title, isVisible, clickCount: 0, viewCount: 0 });

        return NextResponse.json(
            { message: "Data added successfully!", data: result, status: 200 },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
        await client.close();
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
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isVisible } },
            { $inc: { clickCount: 1 } }
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

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const data = await collection.find({ username }).toArray();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    } finally {
    }
}

export async function DELETE(req) {

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        // Ensure the id is a valid ObjectId
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
    } finally {
        await client.close();
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

        const userIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.socket.remoteAddress; // Get User IP
        const collection = await connectToDb();

        // ✅ Ensure the document exists
        const profile = await collection.findOne({ _id: new ObjectId(id) });

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        // ✅ Handle view count update
        if (type === "view") {
            if (!profile.viewedBy) profile.viewedBy = []; // Ensure viewedBy array exists

            const alreadyViewed = profile.viewedBy.includes(userIp);

            if (!alreadyViewed) {
                await collection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { viewCount: 1 },
                        $push: { viewedBy: userIp }, // Store IP to prevent duplicate views
                    }
                );
            }
        }

        // ✅ Handle click count update
        if (type === "click") {
            await collection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $inc: { clickCount: 1 },
                }
            );
        }

        return NextResponse.json({ message: `${type} count updated successfully!` });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
