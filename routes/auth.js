const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = []; // temporary memory storage
const SECRET_KEY = "petrolpumpsecret";

// SIGNUP
router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        name,
        email,
        password: hashedPassword,
        role
    });

    res.status(201).json({ message: "Account created successfully" });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.json({
        message: "Login successful",
        token,
        role: user.role
    });
});

module.exports = router;