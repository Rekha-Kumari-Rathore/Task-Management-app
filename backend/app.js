const express = require("express");
const cors = require("cors"); // Only import once
const app = express();

// Load environment variables
require("dotenv").config();

// Ensure DB connection
require("./conn/conn");

const UserAPI = require("./routes/user");
const TaskAPI = require("./routes/task");

// Middleware setup for CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization", "id"], // Allow 'Authorization' and 'id' headers
};

// Enable CORS with the options
app.use(cors(corsOptions)); 

// Middleware to parse incoming JSON requests
app.use(express.json());

// Route setup for APIs
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);

// Test endpoint for backend
app.use("/", (req, res) => {
    res.send("Hello from backend side");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);  // Log the error details

    // Specific error handling for validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Validation error", details: err.errors });
    }

    // Catch unknown errors or general errors
    res.status(500).json({ message: "Something went wrong on the server" });
});

// Set up the server to listen on a specific PORT (default is 1000)
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
