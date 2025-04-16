const mongoose = require("mongoose");

let retries = 5;  // Retry limit
let retryDelay = 5000;  // Initial delay in milliseconds
let maxRetryDelay = 30000; // Maximum delay before retrying (in milliseconds)

const conn = async () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        process.exit(1);  // Exit if the Mongo URI is not available
    }

    let attempt = 0;
    while (attempt < retries) {
        try {
            console.log(`Attempting to connect to DB... (Attempt ${attempt + 1}/${retries})`);

            // MongoDB connection options
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000, // Connection timeout (5 seconds)
                useNewUrlParser: true,           // Ensure MongoDB connection parser is up to date
                useUnifiedTopology: true        // Ensure new MongoDB driver connection behavior
            });

            console.log("Connected to DB successfully");
            return;  // Exit the function if the connection is successful
        } catch (error) {
            console.error("Failed to connect to DB:", error.message);

            // Log the full error stack for debugging
            console.error("Error stack:", error.stack);

            attempt++;
            if (attempt < retries) {
                console.log(`Retrying connection in ${retryDelay / 1000} seconds... (${retries - attempt} retries left)`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));  // Wait before retrying
                retryDelay = Math.min(retryDelay * 2, maxRetryDelay);  // Exponential backoff, but capped at maxRetryDelay
            } else {
                console.error("Maximum retry attempts reached. Exiting...");
                // Provide more context before exiting
                console.error("Failed to establish connection with MongoDB after multiple attempts.");
                setTimeout(() => {
                    process.exit(1);  // Exit the process if max retries are reached, after a slight delay
                }, 2000);  // Optional: Delay exit for 2 seconds to allow logs to flush
            }
        }
    }
};

// Call the function to connect to the database
conn();
