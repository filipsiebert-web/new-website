import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data file path relative to this file
const DATA_FILE = path.join(__dirname, "login-info.tsx");

export const authRouter = express.Router();

// Ensure file exists with Admin account
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "username-Admin\npassword-F1lip@\n");
} else {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const lines = data.split("\n").map(l => l.trim()).filter(Boolean);
    let adminExists = false;
    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] === "username-Admin") {
            adminExists = true;
            break;
        }
    }
    if (!adminExists) {
        fs.appendFileSync(DATA_FILE, "username-Admin\npassword-F1lip@\n");
    }
}

authRouter.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    if (password.length < 4) return res.status(400).json({ error: "Password must be at least 4 characters" });

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const lines = data.split("\n").map(l => l.trim()).filter(Boolean);
    
    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] === `username-${username}`) return res.status(400).json({ error: "Username already exists" });
    }

    fs.appendFileSync(DATA_FILE, `username-${username}\npassword-${password}\n`);
    res.json({ message: "Registration successful" });
});

authRouter.post("/login", (req, res) => {
    const { username, password } = req.body;
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const lines = data.split("\n").map(l => l.trim()).filter(Boolean);

    let found = false;
    for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] === `username-${username}` && lines[i+1] === `password-${password}`) {
            found = true;
            break;
        }
    }

    if (found) res.json({ username });
    else res.status(401).json({ error: "Invalid username or password" });
});

authRouter.get("/users", (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const lines = data.split("\n").map(l => l.trim()).filter(Boolean);
        const users = [];
        for (let i = 0; i < lines.length; i += 2) {
            users.push({
                username: lines[i].replace("username-", ""),
                password: lines[i+1].replace("password-", "")
            });
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to read users" });
    }
});

authRouter.delete("/users/:username", (req, res) => {
    const { username } = req.params;
    if (username === "Admin") return res.status(403).json({ error: "Cannot delete the Admin account" });

    try {
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const lines = data.split("\n").map(l => l.trim()).filter(Boolean);
        const newLines = [];
        let found = false;
        for (let i = 0; i < lines.length; i += 2) {
            if (lines[i] !== `username-${username}`) {
                newLines.push(lines[i], lines[i+1]);
            } else found = true;
        }
        if (!found) return res.status(404).json({ error: "User not found" });
        fs.writeFileSync(DATA_FILE, newLines.join("\n") + "\n");
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});
