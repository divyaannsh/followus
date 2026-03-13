import { MongoClient, ObjectId } from "mongodb";
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

function normalizeSlug(input = "") {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32);
}

function generateSlug(length = 7) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { username, originalUrl, customSlug } = body;

        if (!username || !originalUrl) {
            return NextResponse.json({ message: "username and originalUrl are required" }, { status: 400 });
        }

        const collection = await connectToDb();
        let slug = normalizeSlug(customSlug || "");

        if (slug) {
            const existing = await collection.findOne({ slug });
            if (existing) {
                return NextResponse.json({ message: "Custom slug already exists" }, { status: 409 });
            }
        } else {
            let attempts = 0;
            do {
                slug = generateSlug();
                attempts += 1;
            } while (attempts < 10 && await collection.findOne({ slug }));
        }

        await collection.insertOne({
            username,
            originalUrl,
            slug,
            clickCount: 0,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Short link created", slug }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ message: "username is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        const links = await collection.find({ username }).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(links, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Valid id is required" }, { status: 400 });
        }

        const collection = await connectToDb();
        await collection.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ message: "Short link deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
