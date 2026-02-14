import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI || "";
const client = uri ? new MongoClient(uri) : null;
const dbName = "templates";
const collectionName = "template01";

async function connectToDb() {
    if (!client) {
        throw new Error("MongoDB client not initialized. Check MONGO_URI environment variable.");
    }
    await client.connect();
    const database = client.db(dbName);
    return database.collection(collectionName);
}

// POST API - Insert profile data & ensure only one selected template
export async function POST(req) {
    try {
        const body = await req.json();
        const collection = await connectToDb();

        // Ensure required fields exist
        if (!body.profileName || !body.bio || !body.image || !body.linksData || !body.bgcolor) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // If the new template is selected, set all others to `isSelected: false`
        if (body.isSelected) {
            await collection.updateMany({}, { $set: { isSelected: false } });
        }

        // Insert new template
        const result = await collection.insertOne(body);

        return NextResponse.json({ message: "Template created successfully", data: result }, { status: 201 });

    } catch (error) {
        console.error("Error inserting data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET API - Retrieve all templates from MongoDB
export async function GET() {
    try {
        const collection = await connectToDb();
        const templates = await collection.find().toArray();

        return NextResponse.json({ message: "Templates fetched successfully", data: templates }, { status: 200 });

    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE API - Remove a template by ID
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
            return NextResponse.json({ message: "No template found with the provided ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Template deleted successfully", data: result }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PATCH API - Update template selection (ensure only one is selected)
export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, isSelected, type } = body;

        if (!id) {
            return NextResponse.json({ message: "Invalid data" }, { status: 400 });
        }

        const collection = await connectToDb();

        // If selecting this template, unselect all others
        if (isSelected) {
            await collection.updateMany({}, { $set: { isSelected: false } });
        }

        // Update the selected template
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { isSelected }, $set: { type } });

        if (result.modifiedCount === 0) {
            return NextResponse.json({ message: "No template found with the provided ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Template selection updated", data: result }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
