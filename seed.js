const mongoose = require("mongoose");
const path = require("path");

// Load backend .env variables from the root directory
require("dotenv").config({ path: path.join(__dirname, "backend", ".env") });

const User = require("./backend/models/User");
const TravelLog = require("./backend/models/TravelLog");
const Comment = require("./backend/models/Comment");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/travel-log-app";
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully!");

    // Clear existing data
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await TravelLog.deleteMany({});
    await Comment.deleteMany({});
    console.log("Database cleared.");

    // Create Test User
    console.log("Creating users...");
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123", // Model pre-save hook will hash this
      profilePicture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Avid traveler, hiker, and photographer. Always searching for the next high-altitude trail and local culture."
    });

    const user2 = await User.create({
      name: "Sophia Martinez",
      email: "sophia@example.com",
      password: "password123",
      profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Beach lover, surfer, and culinary explorer traveling across Southeast Asia."
    });

    const user3 = await User.create({
      name: "Alex Johnson",
      email: "alex@example.com",
      password: "password123",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      bio: "Digital nomad writing code from cozy mountain cabins and tropical cafes."
    });

    console.log("Users created successfully.");

    // Create Travel Stories for Test User
    console.log("Creating travel logs...");
    const log1 = await TravelLog.create({
      user: testUser._id,
      title: "Exploring the Serenity of Pokhara",
      destination: "Pokhara, Nepal",
      dateOfTravel: new Date("2026-06-15"),
      rating: 5,
      tags: ["lakes", "mountains", "peace", "boating"],
      description: `Pokhara is absolute heaven on earth! Spent three wonderful days waking up to views of the Annapurna mountain range reflecting on the calm waters of Phewa Lake. 

On our first day, we rented a traditional colorful wooden boat and rowed to the Tal Barahi Temple situated on a small island in the middle of the lake. The quietness of the water surrounded by lush hills was deeply soothing. 

The next morning, we woke up at 4:30 AM to catch the sunrise from Sarangkot. The viewpoint was packed but witnessing the golden light strike Mount Machhapuchhre (Fishtail Peak) made all the crowds disappear. It was a spiritual moment. Highly recommend Pokhara to anyone wanting a mix of adventure and peace!`,
      photos: [
        "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
      ],
      likes: [user2._id, user3._id]
    });

    const log2 = await TravelLog.create({
      user: testUser._id,
      title: "Rugged Offroad Adventure in Upper Mustang",
      destination: "Mustang, Nepal",
      dateOfTravel: new Date("2026-05-10"),
      rating: 5,
      tags: ["adventure", "roadtrip", "desert", "culture"],
      description: `Driving into Upper Mustang feels like entering a completely different planet. The landscape shifts dramatically from green valleys to arid, wind-swept canyons and red clay cliffs dotted with ancient cave dwellings.

We rented a 4x4 Jeep from Pokhara and drove through the Kali Gandaki Gorge, the deepest gorge in the world. The road was incredibly challenging, with river crossings and rocky cliffside paths that kept our adrenaline pumping.

Reaching Lo Manthang, the walled capital of the former Kingdom of Lo, was like stepping back in time. We visited centuries-old monasteries painted with exquisite Buddhist murals and met the hospitable local Loba people. This is a must-do journey for true adventure seekers!`,
      photos: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
      ],
      likes: [user2._id]
    });

    const log3 = await TravelLog.create({
      user: testUser._id,
      title: "Chasing Waterfalls & Sunsets in Bali",
      destination: "Bali, Indonesia",
      dateOfTravel: new Date("2026-03-01"),
      rating: 4,
      tags: ["waterfalls", "beach", "tropical", "sunset"],
      description: `Spent a magical week exploring the diverse landscapes of Bali. We started our journey in Ubud, renting a scooter to explore the lush green Tegalalang Rice Terraces early in the morning before the tourist buses arrived. 

We then drove North to Sekumpul Waterfall, which is hands down one of the most stunning waterfalls in Southeast Asia. The trek down is steep and muddy, but standing at the base looking up at three massive falls surrounded by tropical jungle was breathtaking.

We wrapped up the trip in Uluwatu, watching the sunset from the cliffside temple and eating fresh seafood on the sand at Jimbaran Bay. The hospitality of the Balinese people is unmatched. We will definitely be back!`,
      photos: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1552678682-6e40ef438655?auto=format&fit=crop&w=1200&q=80"
      ],
      likes: [user3._id]
    });

    // Create a Travel Log for User 2 (Sophia) so there's variety on the Home feed
    const log4 = await TravelLog.create({
      user: user2._id,
      title: "Scuba Diving with Manta Rays in Nusa Penida",
      destination: "Nusa Penida, Indonesia",
      dateOfTravel: new Date("2026-03-05"),
      rating: 5,
      tags: ["diving", "ocean", "manta", "marine-life"],
      description: `Diving at Manta Point off Nusa Penida was one of the most thrilling experiences of my life! The water was quite cold and choppy, but the moment we descended, we were surrounded by four massive, graceful reef manta rays gliding effortlessly through the water.

One manta ray, with a wingspan of at least 4 meters, swam directly above my head, close enough that I could see its gills breathing. They are incredibly curious and gentle giants. 

After the dive, we visited Kelingking Beach to marvel at the famous T-Rex-shaped cliff structure from above. An absolute dream destination!`,
      photos: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
      ],
      likes: [testUser._id, user3._id]
    });

    console.log("Travel logs created successfully.");

    // Create Comments
    console.log("Creating comments...");
    await Comment.create([
      {
        log: log1._id,
        user: user2._id,
        text: "Pokhara looks so beautiful! Sarangkot is on my bucket list. Thanks for sharing these amazing photos!"
      },
      {
        log: log1._id,
        user: user3._id,
        text: "Awesome story! Were the rowboats easy to hire, or did you need a guide?"
      },
      {
        log: log1._id,
        user: testUser._id,
        text: "Thanks guys! @Alex, yes, they are super easy to hire right from the Lakeside docks. You can hire them with or without a boatman."
      },
      {
        log: log2._id,
        user: user2._id,
        text: "Mustang looks like an epic adventure! Was the road very dangerous?"
      },
      {
        log: log3._id,
        user: user3._id,
        text: "Sekumpul is spectacular! Did you hire a local guide for the hike down?"
      },
      {
        log: log4._id,
        user: testUser._id,
        text: "Wow Sophia! Swimming with Mantas looks out of this world! Incredible shot!"
      }
    ]);
    console.log("Comments created successfully.");

    console.log("Seeding completed successfully! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
