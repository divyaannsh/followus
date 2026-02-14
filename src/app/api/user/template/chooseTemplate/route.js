// Backend: Next.js API Route
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
const dbName = "templates";
const collectionName = "chooseTemplate";

async function connectToDb() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    const database = client.db(dbName);
    return database.collection(collectionName);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, templateId, profileName, bio, image, linksData, bgcolor } = body;

        if (!templateId || !username) {
            return NextResponse.json({ error: "username  and Template ID are required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const user = await collection.findOne({ username });

        if (user) {
            const updateResult = await collection.updateOne(
                { username },
                {
                    $set: {
                        selectedTemplate: templateId,
                        profileName,
                        bio,
                        image,
                        linksData,
                        bgcolor,
                    },
                }
            );
            if (updateResult.modifiedCount === 0) {
                return NextResponse.json({ error: "Failed to update template selection" }, { status: 500 });
            }
        } else {
            await collection.insertOne({ username, selectedTemplate: templateId, profileName, bio, image, linksData, bgcolor });
        }
        return NextResponse.json({ message: "Template selected successfully", selectedTemplate: templateId }, { status: 200 });
    } catch (error) {
        console.error("Error selecting template:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function GET(request) {
  try {
    // Extract userId from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    // Validate userId
    if (!username) {
      return NextResponse.json({ success: false, message: "username  is required", data: [] }, { status: 400 });
    }

    // Connect to the database
    const collection = await connectToDb();

    // Fetch templates for the user
    const choosetemplates = await collection.find({ username }).toArray();

    // Respond with standardized structure
    return NextResponse.json(
      {
        success: true,
        message: "Templates fetched successfully",
        data: choosetemplates, // Returning array in data field
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    // Standard error response
    return NextResponse.json(
      { success: false, message: "Internal Server Error", data: [] },
      { status: 500 }
    );
  }
}
