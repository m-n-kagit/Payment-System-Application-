import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { exec } from "child_process";
import connectDB from "./DB_connect/index.js";
import { User } from "./schema/user.js";
import { Owner } from "./schema/owner.js";
import { PaymentHistory } from "./schema/paymentHistory.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Get User Detail
app.get("/api/user", async (req, res) => {
    try {
        const user = await User.findOne();
        if (!user) return res.status(404).json({ error: "No user found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Owner Detail
app.get("/api/owner", async (req, res) => {
    try {
        const owner = await Owner.findOne();
        if (!owner) return res.status(404).json({ error: "No owner found" });
        res.json(owner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Payment History
app.get("/api/history", async (req, res) => {
    try {
        const history = await PaymentHistory.find().sort({ date: -1 }).populate('userId', 'name email');
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Process Payment via PHP script
app.post("/api/pay", async (req, res) => {
    const { amount, userId } = req.body;
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.balance < amount) {
            return res.status(400).json({ error: "Insufficient pseudo balance" });
        }

        // Call the PHP script to simulate payment
        exec(`php process_payment.php --amount=${amount} --userId=${userId}`, async (error, stdout, stderr) => {
            if (error) {
                console.error("PHP Execution Error:", error);
                return res.status(500).json({ error: "Payment processing failed" });
            }

            try {
                // PHP script returns JSON
                const response = JSON.parse(stdout);
                
                if (response.status === "success") {
                    // Subtract from user balance
                    user.balance -= amount;
                    await user.save();

                    // Increment owner earnings
                    let owner = await Owner.findOne();
                    if (!owner) {
                        owner = new Owner({ name: "System Owner", earnings: 0 });
                    }
                    owner.earnings += amount;
                    await owner.save();

                    // Record transaction history
                    const history = new PaymentHistory({
                        userId: user._id,
                        amount: amount,
                        method: "Direct Payment",
                        status: "Completed"
                    });
                    await history.save();

                    return res.json({ success: true, message: "Payment successful", balance: user.balance, transaction: response });
                } else {
                    return res.status(400).json({ error: response.message || "Payment failed in SDK" });
                }
            } catch (err) {
                console.error("JSON Parsing Error from PHP output:", err);
                return res.status(500).json({ error: "Invalid response from payment gateway" });
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
