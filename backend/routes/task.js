const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const { authenticateToken } = require("./auth");

// Create Task
router.post("/create-task", authenticateToken, async (req, res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.user; // Access user from decoded token

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if task with this title already exists for the user
        const existingTask = await Task.findOne({ title, user: id });
        if (existingTask) {
            return res.status(400).json({ message: "Task with this title already exists." });
        }

        const newTask = new Task({ title, description: desc, user: id });
        await newTask.save();

        await User.findByIdAndUpdate(id, { $push: { tasks: newTask._id } });

        res.status(200).json({ message: "Task created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get All Tasks
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;

        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: { createdAt: -1 } }
        });

        if (!userData || !userData.tasks) {
            return res.status(404).json({ message: "No tasks found for the user." });
        }

        res.status(200).json({ data: userData.tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Delete Task
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user;

        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you do not have permission to delete it." });
        }

        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Update Task
router.put("/update-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        const { id: userId } = req.user;

        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you do not have permission to update it." });
        }

        task.title = title;
        task.description = desc;
        await task.save();

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


// Update Important Task
router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { important } = req.body; // Expecting { important: true/false }
        const { id: userId } = req.user;

        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you do not have permission to update it." });
        }

        task.important = important;
        await task.save();

        res.status(200).json({ message: "Task importance updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Update Completed Task
router.put("/update-complete-task/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body; // Expecting { completed: true/false }
        const { id: userId } = req.user;

        const task = await Task.findOne({ _id: id, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or you do not have permission to update it." });
        }

        task.completed = completed;
        await task.save();

        res.status(200).json({ message: "Task completion status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get Important Tasks
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
    try {
        const { id: userId } = req.user;

        const tasks = await Task.find({ user: userId, important: true });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No important tasks found." });
        }

        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get Completed Tasks
router.get("/get-completed-tasks", authenticateToken, async (req, res) => {
    try {
        const { id: userId } = req.user;

        const tasks = await Task.find({ user: userId, completed: true });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No completed tasks found." });
        }

        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get Incompleted Tasks
router.get("/get-incompleted-tasks", authenticateToken, async (req, res) => {
    try {
        const { id: userId } = req.user;

        const tasks = await Task.find({ user: userId, completed: false });
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No incomplete tasks found." });
        }

        res.status(200).json({ data: tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});



module.exports = router;
