import mongoose from "mongoose";
import connectDB from "./DB_connect/index.js";
import { User } from "./schema/user.js";
import { Owner } from "./schema/owner.js";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany();
        await Owner.deleteMany();

        console.log("Existing data cleared.");

        // Dummy user details array as requested
        const dummyUsers = [
            {
                name: "Ria Chakravorthy",
                email: "ria123@gmail.com",
                password: "Ria@123", // normally hashed, but this is a dummy
                role: "user",
                balance: 10000 // initial pseudo money balance
            }
        ];

        await User.insertMany(dummyUsers);
        console.log("Dummy user created with initial balance.");

        const owner = new Owner({
            name: "Aaryan",
            email: "[EMAIL_ADDRESS]",
            password: "Aaryan@123",
            earnings: 0
        });

        await owner.save();
        console.log("Owner created.");

        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
