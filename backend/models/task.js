const mongoose = require('mongoose');

// Define Task Schema
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    important: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User", // The name of the User model
      required: true, // Ensure the user is set
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create compound index to enforce unique title per user
TaskSchema.index({ title: 1, user: 1 }, { unique: true });

// Register the model
module.exports = mongoose.model('Task', TaskSchema);
