// seedTemplates.mjs
// Run with: node scripts/seedTemplates.mjs

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";

// Read MONGO_URI from .env manually (no dotenv needed in ESM)
const envContent = readFileSync(new URL("../.env", import.meta.url), "utf-8");
const mongoUriMatch = envContent.match(/MONGO_URI\s*=\s*(.+)/);
if (!mongoUriMatch) {
    console.error("❌  MONGO_URI not found in .env");
    process.exit(1);
}
const uri = mongoUriMatch[1].trim().replace(/^["']|["']$/g, "");

const client = new MongoClient(uri);

const templates = [
    // ── FASHION ──────────────────────────────────────────────────
    {
        profileName: "Luxe & Co.",
        bio: "Premium fashion for the modern soul. Style is a language — speak fluently.",
        image: "/img/TempImage1.jpeg",
        type: "Fashion",
        bgcolor: "#f2f2f2", // Clean minimal grey for fashion
        isSelected: false,
        linksData: [
            { id: "f1", title: "New Arrivals 🆕", url: "#" },
            { id: "f2", title: "Shop Women", url: "#" },
            { id: "f3", title: "Shop Men", url: "#" },
            { id: "f4", title: "Style Blog", url: "#" },
            { id: "f5", title: "Size Guide", url: "#" },
        ],
    },
    {
        profileName: "VogueVault",
        bio: "Curated looks. Timeless elegance. Your personal style advisor.",
        image: "/img/TempImage1.jpeg",
        type: "Fashion",
        bgcolor: "#000000", // Stark black, high fashion Vogue style
        isSelected: false,
        linksData: [
            { id: "vv1", title: "Lookbook 2025", url: "#" },
            { id: "vv2", title: "Shop Sale", url: "#" },
            { id: "vv3", title: "Gift Cards", url: "#" },
            { id: "vv4", title: "Brand Story", url: "#" },
        ],
    },

    // ── HEALTH & FITNESS ─────────────────────────────────────────
    {
        profileName: "FitLife Hub",
        bio: "Transform your body. Elevate your mind. 💪 Free workouts & meal plans.",
        image: "/img/TempImage1.jpeg",
        type: "Health and Fitness",
        bgcolor: "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)", // Energetic sport green
        isSelected: false,
        linksData: [
            { id: "h1", title: "Free Workout Plan 🏋️", url: "#" },
            { id: "h2", title: "7-Day Meal Prep Guide", url: "#" },
            { id: "h3", title: "1:1 Coaching", url: "#" },
            { id: "h4", title: "Supplement Shop", url: "#" },
            { id: "h5", title: "Join Community", url: "#" },
        ],
    },
    {
        profileName: "MindBody Reset",
        bio: "Yoga • Meditation • Wellness. Reset your body & reconnect with yourself. 🧘",
        image: "/img/TempImage1.jpeg",
        type: "Health and Fitness",
        bgcolor: "#e2d2ca", // Calming beige/sand for yoga
        isSelected: false,
        linksData: [
            { id: "mb1", title: "Morning Yoga Flow ☀️", url: "#" },
            { id: "mb2", title: "Meditation Library", url: "#" },
            { id: "mb3", title: "Book a Retreat", url: "#" },
            { id: "mb4", title: "Wellness Blog", url: "#" },
        ],
    },

    // ── INFLUENCER & CREATOR ─────────────────────────────────────
    {
        profileName: "Creator Studio",
        bio: "Content creator • Storyteller • Collaborator. Let's build something great 🎬",
        image: "/img/TempImage1.jpeg",
        type: "Influencer and Creator",
        bgcolor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%)", // Aesthetic pastel pink
        isSelected: false,
        linksData: [
            { id: "c1", title: "Watch Latest Video 🎥", url: "#" },
            { id: "c2", title: "Brand Collabs", url: "#" },
            { id: "c3", title: "My Preset Pack", url: "#" },
            { id: "c4", title: "Newsletter", url: "#" },
            { id: "c5", title: "Merch Store 👕", url: "#" },
        ],
    },
    {
        profileName: "The Reel Life",
        bio: "Sharing real moments, real stories. POV: your new fave creator 🌟",
        image: "/img/TempImage1.jpeg",
        type: "Influencer and Creator",
        bgcolor: "radial-gradient(circle at top right, #ff0844 0%, #ffb199 100%)", // Vibrant trendy creator
        isSelected: false,
        linksData: [
            { id: "rl1", title: "Subscribe on YouTube", url: "#" },
            { id: "rl2", title: "Shop My Favorite Things", url: "#" },
            { id: "rl3", title: "Work With Me", url: "#" },
            { id: "rl4", title: "Podcast 🎙️", url: "#" },
        ],
    },

    // ── MARKETING ────────────────────────────────────────────────
    {
        profileName: "GrowthLab",
        bio: "Data-driven marketing for ambitious brands. Scale faster, smarter. 📈",
        image: "/img/TempImage1.jpeg",
        type: "Marketing",
        bgcolor: "#1e293b", // Professional slate tone
        isSelected: false,
        linksData: [
            { id: "m1", title: "Free Marketing Audit", url: "#" },
            { id: "m2", title: "Case Studies", url: "#" },
            { id: "m3", title: "Book a Strategy Call", url: "#" },
            { id: "m4", title: "Resources & Templates", url: "#" },
            { id: "m5", title: "Newsletter", url: "#" },
        ],
    },
    {
        profileName: "BrandBoost",
        bio: "Social media • SEO • Ads. We turn clicks into customers. 🚀",
        image: "/img/TempImage1.jpeg",
        type: "Marketing",
        bgcolor: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", // Tech/Corporate blue
        isSelected: false,
        linksData: [
            { id: "bb1", title: "Get a Free Quote", url: "#" },
            { id: "bb2", title: "Our Services", url: "#" },
            { id: "bb3", title: "Client Reviews ⭐", url: "#" },
            { id: "bb4", title: "Blog", url: "#" },
        ],
    },

    // ── SMALL BUSINESS ───────────────────────────────────────────
    {
        profileName: "The Local Brew",
        bio: "Artisan coffee roasted with love. Visit us or order online ☕",
        image: "/img/TempImage1.jpeg",
        type: "Small Business",
        bgcolor: "#f3e5ab", // Warm inviting vanilla/coffee hue
        isSelected: false,
        linksData: [
            { id: "sb1", title: "Order Online ☕", url: "#" },
            { id: "sb2", title: "Our Menu", url: "#" },
            { id: "sb3", title: "Find Us", url: "#" },
            { id: "sb4", title: "Gift Cards", url: "#" },
            { id: "sb5", title: "Loyalty Program", url: "#" },
        ],
    },
    {
        profileName: "Bloom & Petal",
        bio: "Fresh flowers for every occasion. Same-day delivery available 🌸",
        image: "/img/TempImage1.jpeg",
        type: "Small Business",
        bgcolor: "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)", // Fresh organic green
        isSelected: false,
        linksData: [
            { id: "bp1", title: "Shop Bouquets 💐", url: "#" },
            { id: "bp2", title: "Wedding Florals", url: "#" },
            { id: "bp3", title: "Custom Orders", url: "#" },
            { id: "bp4", title: "Care Tips", url: "#" },
        ],
    },

    // ── MUSIC ────────────────────────────────────────────────────
    {
        profileName: "SoundWave",
        bio: "Indie artist. New EP out now 🎧 Catch me on tour this summer.",
        image: "/img/TempImage1.jpeg",
        type: "Music",
        bgcolor: "radial-gradient(circle at center, #141e30 0%, #000000 100%)", // Deep concert black/blue
        isSelected: false,
        linksData: [
            { id: "mu1", title: "🎵 Stream New EP", url: "#" },
            { id: "mu2", title: "Tour Dates", url: "#" },
            { id: "mu3", title: "Merch Store", url: "#" },
            { id: "mu4", title: "Fan Club", url: "#" },
            { id: "mu5", title: "Music Videos 🎬", url: "#" },
        ],
    },
    {
        profileName: "BeatForge",
        bio: "Producer • Beats • Collabs. Your sound starts here 🎹",
        image: "/img/TempImage1.jpeg",
        type: "Music",
        bgcolor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", // Electronic / EDM neon
        isSelected: false,
        linksData: [
            { id: "bf1", title: "Beat Store 🔥", url: "#" },
            { id: "bf2", title: "Collab Request", url: "#" },
            { id: "bf3", title: "Mixing & Mastering", url: "#" },
            { id: "bf4", title: "Free Loop Pack", url: "#" },
        ],
    },

    // ── SOCIAL MEDIA ─────────────────────────────────────────────
    {
        profileName: "Scroll & Scroll",
        bio: "Social media tips, tricks & trends. Follow for daily content inspo 📲",
        image: "/img/TempImage1.jpeg",
        type: "Social Media",
        bgcolor: "linear-gradient(to right, #fa709a 0%, #fee140 100%)", // Warm sunset Instagram vibe
        isSelected: false,
        linksData: [
            { id: "sm1", title: "Instagram Growth Guide 📈", url: "#" },
            { id: "sm2", title: "Content Calendar Template", url: "#" },
            { id: "sm3", title: "1:1 Consulting", url: "#" },
            { id: "sm4", title: "YouTube Channel", url: "#" },
            { id: "sm5", title: "Free Canva Templates", url: "#" },
        ],
    },
    {
        profileName: "Viral Vault",
        bio: "Helping brands go viral since 2022. Strategy • Content • Growth 🔥",
        image: "/img/TempImage1.jpeg",
        type: "Social Media",
        bgcolor: "linear-gradient(to top, #30cfd0 0%, #330867 100%)", // TikTok inspired deep contrast
        isSelected: false,
        linksData: [
            { id: "vv1", title: "Viral Reels Strategy 🎬", url: "#" },
            { id: "vv2", title: "Brand Audit", url: "#" },
            { id: "vv3", title: "Course: 0 to 10K", url: "#" },
            { id: "vv4", title: "Community Access", url: "#" },
        ],
    },
];

async function seed() {
    try {
        await client.connect();
        const db = client.db("templates");
        const col = db.collection("template01");

        console.log(`\n🧹  Clearing existing templates...`);
        await col.deleteMany({});
        console.log(`\n🌱  Inserting ${templates.length} new templates...\n`);

        let inserted = 0;
        for (const tmpl of templates) {
            const result = await col.insertOne(tmpl);
            console.log(`  ✅  [${tmpl.type.padEnd(25)}]  "${tmpl.profileName}"  → ${result.insertedId}`);
            inserted++;
        }

        console.log(`\n🎉  Done! Inserted ${inserted} templates.\n`);
    } catch (err) {
        console.error("❌  Seed failed:", err.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seed();
