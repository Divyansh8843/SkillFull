const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const db = require("../config/database");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Login/Register with Google
router.post(
  "/google",
  [
    body("email").isEmail().normalizeEmail(),
    body("name").trim().isLength({ min: 1 }),
    body("googleId").trim().isLength({ min: 1 }),
    body("picture").optional().isURL(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, name, googleId, picture } = req.body;

      // Check if user exists
      const existingUsers = await db.executeQuery(
        "SELECT * FROM users WHERE email = ? OR id = ?",
        [email, googleId]
      );

      let user;
      if (existingUsers.length > 0) {
        // Update existing user
        user = existingUsers[0];
        await db.executeQuery(
          "UPDATE users SET name = ?, picture_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [name, picture, user.id]
        );
      } else {
        // Create new user
        await db.executeQuery(
          "INSERT INTO users (id, email, name, picture_url) VALUES (?, ?, ?, ?)",
          [googleId, email, name, picture]
        );

        const newUser = await db.executeQuery(
          "SELECT * FROM users WHERE id = ?",
          [googleId]
        );
        user = newUser[0];
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture_url,
          bio: user.bio,
          skills: user.skills ? JSON.parse(user.skills) : [],
          rating: parseFloat(user.rating),
          totalReviews: user.total_reviews,
        },
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
);

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const users = await db.executeQuery("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = users[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture_url,
      bio: user.bio,
      skills: user.skills ? JSON.parse(user.skills) : [],
      rating: parseFloat(user.rating),
      totalReviews: user.total_reviews,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Verify token
router.get("/verify", authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

module.exports = router;
