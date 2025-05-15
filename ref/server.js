// server.js (or your main backend file)
require('dotenv').config(); // Load environment variables from .env file AT THE VERY TOP

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// bodyParser is deprecated for express 4.16.0+
// Use express.json() and express.urlencoded() instead
// const bodyParser = require("body-parser"); // No longer strictly needed for JSON
const connectDB = require("./db");
const Car = require("./models/Car");
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5001; // Changed default port to 5001

// --- API Key Handling ---
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: GEMINI_API_KEY is not defined in .env file.");
    process.exit(1); // Exit if the API key is not found
}

console.log("API Key length:", apiKey.length);
console.log("API Key first 5 chars:", apiKey.substring(0, 5));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(apiKey);

// Add route to list models
app.get("/api/list-models", async (req, res) => {
    try {
        const models = await genAI.listModels();
        console.log("Available models:", models);
        res.json(models);
    } catch (error) {
        console.error("Failed to list models:", error);
        res.status(500).json({ error: "Failed to list models", details: error.toString() });
    }
});

// Connect to MongoDB
// Temporarily commenting out MongoDB connection
// connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Route to fetch all cars
app.get("/api/cars", async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        console.error("Failed to fetch car data:", error);
        res.status(500).json({ error: "Failed to fetch car data" });
    }
});

// Route to fetch a car by model name
app.get("/api/cars/:model", async (req, res) => {
    try {
        const car = await Car.findOne({ model: req.params.model });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json(car);
    } catch (error) {
        console.error("Failed to fetch car data for model:", error);
        res.status(500).json({ error: "Failed to fetch car data" });
    }
});

// Route to handle AI chat requests using Gemini
app.post("/api/ask", async (req, res) => {
    const { message, brand } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    if (!brand) {
        return res.status(400).json({ error: "Brand selection is required" });
    }

    try {
        console.log("Received message for Gemini:", message);
        console.log("Selected brand:", brand);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

        // Create a prompt that focuses on the selected brand
        const prompt = `You are a car expert specializing in ${brand} vehicles. 
        Please provide information only about ${brand} cars and their features, specifications, history, and models.
        If the user asks about other brands, only provide information if it's relevant to comparing with ${brand}.
        If the question is not related to cars or ${brand}, politely inform the user that you can only provide information about ${brand} vehicles.
        
        User question: ${message}`;

        console.log("Sending prompt to Gemini:", prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini reply:", text);
        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        let errorMessage = "Failed to fetch response from Gemini";
        if (error.message) {
            errorMessage += `: ${error.message}`;
        }
        res.status(500).json({ error: errorMessage, details: error.toString() });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});