const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,  // Automatically creates an index for username
      minlength: 4,  // Minimum length for username
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],  // Email format validation
      unique: true,  // Automatically creates an index for email
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  // Ensure minimum length for password
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Task",  // Reference to the Task model
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],  // Limit roles to "user" or "admin"
      default: "user",  // Default to "user" role
    },
    emailVerified: {
      type: Boolean,
      default: false,  // Default emailVerified to false
    },
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Password hashing before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();  // Only hash the password if it's new or modified

  try {
    const saltRounds = process.env.SALT_ROUNDS || 10;  // Default to 10 if not provided
    const salt = await bcrypt.genSalt(Number(saltRounds));  // Generate salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);  // Pass the error to the next middleware (will be caught by error handler)
  }
});

// Method to compare password (for login functionality)
userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);  // Compare the entered password with the hashed password
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

// Optional: Index for tasks field (if you query tasks often)
userSchema.index({ tasks: 1 });

// Create and return the model for User
module.exports = mongoose.model("User", userSchema);
