const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const db = require("../config/database");

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Get all help requests
router.get("/", async (req, res) => {
  try {
    const { category, urgency, status = "open", search } = req.query;

    let query = `
      SELECT 
        hr.*,
        c.name as category_name,
        u.name as requester_name,
        u.email as requester_email,
        u.picture_url as requester_picture
      FROM help_requests hr
      LEFT JOIN categories c ON hr.category_id = c.id
      LEFT JOIN users u ON hr.requester_id = u.id
      WHERE hr.status = ?
    `;

    const params = [status];

    if (category) {
      query += " AND c.name = ?";
      params.push(category);
    }

    if (urgency) {
      query += " AND hr.urgency = ?";
      params.push(urgency);
    }

    if (search) {
      query += " AND (hr.title LIKE ? OR hr.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY hr.created_at DESC";

    const requests = await db.executeQuery(query, params);

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      title: request.title,
      description: request.description,
      category: request.category_name,
      urgency: request.urgency,
      estimatedDuration: request.estimated_duration,
      location: request.location,
      isRemote: request.is_remote,
      budgetMin: request.budget_min,
      budgetMax: request.budget_max,
      skillsNeeded: Array.isArray(request.skills_needed)
        ? request.skills_needed
        : request.skills_needed
        ? JSON.parse(request.skills_needed)
        : [],
      status: request.status,
      requesterName: request.requester_name,
      requesterEmail: request.requester_email,
      requesterPicture: request.requester_picture,
      createdAt: request.created_at,
      acceptedAt: request.accepted_at,
      completedAt: request.completed_at,
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Create a new help request
router.post(
  "/",
  // authenticateToken, // Temporarily disabled for testing
  [
    body("title").trim().isLength({ min: 1, max: 255 }),
    body("description").trim().isLength({ min: 10 }),
    body("category").optional().trim(),
    body("urgency").isIn(["low", "medium", "high"]),
    body("estimatedDuration").optional().trim(),
    body("location").optional().trim(),
    body("isRemote").optional().isBoolean(),
    body("budgetMin").optional().isNumeric(),
    body("budgetMax").optional().isNumeric(),
    body("skillsNeeded").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        category,
        urgency = "medium",
        estimatedDuration,
        location,
        isRemote = true,
        budgetMin,
        budgetMax,
        skillsNeeded = [],
        requesterName,
        requesterEmail,
        requesterPicture,
      } = req.body;

      // Get or create category
      let categoryId = null;
      if (category) {
        const categories = await db.executeQuery(
          "SELECT id FROM categories WHERE name = ?",
          [category]
        );

        if (categories.length > 0) {
          categoryId = categories[0].id;
        } else {
          // Create new category
          const result = await db.executeQuery(
            "INSERT INTO categories (name, description) VALUES (?, ?)",
            [category, `${category} related requests`]
          );
          categoryId = result.insertId;
        }
      }

      // Insert help request
      const result = await db.executeQuery(
        `INSERT INTO help_requests 
         (requester_id, category_id, title, description, skills_needed, urgency, 
          estimated_duration, location, is_remote, budget_min, budget_max, 
          requester_name, requester_email, requester_picture) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user?.id || "test-user-1", // Temporary fallback for testing
          categoryId,
          title,
          description,
          JSON.stringify(skillsNeeded),
          urgency,
          estimatedDuration,
          location,
          isRemote,
          budgetMin,
          budgetMax,
          requesterName || "Anonymous",
          requesterEmail || "anonymous@example.com",
          requesterPicture || null,
        ]
      );

      // For now, return a simplified response since mock database doesn't handle JOINs
      const formattedRequest = {
        id: result.insertId,
        title,
        description,
        category,
        urgency,
        estimatedDuration,
        location,
        isRemote,
        budgetMin,
        budgetMax,
        skillsNeeded,
        status: "open",
        requesterName: requesterName || "Anonymous",
        requesterEmail: requesterEmail || "anonymous@example.com",
        requesterPicture: requesterPicture || null,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(formattedRequest);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ error: "Failed to create request" });
    }
  }
);

// Accept a help request
router.post(
  "/:id/accept",
  // authenticateToken, // Temporarily disabled for testing
  async (req, res) => {
    try {
      const requestId = req.params.id;
      const helperId = req.user?.id || "test-helper-1"; // Fallback for testing

      console.log("Accept request:", { requestId, helperId });

      // Check if request exists and is open
      const requests = await db.executeQuery(
        "SELECT * FROM help_requests WHERE id = ? AND status = 'open'",
        [requestId]
      );

      if (requests.length === 0) {
        return res
          .status(404)
          .json({ error: "Request not found or already accepted" });
      }

      const request = requests[0];

      // Can't accept your own request
      if (request.requester_id === helperId) {
        return res
          .status(400)
          .json({ error: "Cannot accept your own request" });
      }

      // Update request status
      const updateResult = await db.executeQuery(
        "UPDATE help_requests SET status = 'in_progress', helper_id = ?, accepted_at = CURRENT_TIMESTAMP WHERE id = ?",
        [helperId, requestId]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: "Failed to update request" });
      }

      // For mock database, return a simplified success response
      res.json({
        message: "Request accepted successfully",
        request: {
          id: requestId,
          status: "in_progress",
          helperId: helperId,
          acceptedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      res.status(500).json({ error: "Failed to accept request" });
    }
  }
);

// Get a specific request
router.get("/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    const requests = await db.executeQuery(
      `SELECT 
         hr.*,
         c.name as category_name,
         u.name as requester_name,
         u.email as requester_email,
         u.picture_url as requester_picture,
         h.name as helper_name
       FROM help_requests hr
       LEFT JOIN categories c ON hr.category_id = c.id
       LEFT JOIN users u ON hr.requester_id = u.id
       LEFT JOIN users h ON hr.helper_id = h.id
       WHERE hr.id = ?`,
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requests[0];
    const formattedRequest = {
      id: request.id,
      title: request.title,
      description: request.description,
      category: request.category_name,
      urgency: request.urgency,
      estimatedDuration: request.estimated_duration,
      location: request.location,
      isRemote: request.is_remote,
      budgetMin: request.budget_min,
      budgetMax: request.budget_max,
      skillsNeeded: request.skills_needed
        ? JSON.parse(request.skills_needed)
        : [],
      status: request.status,
      requesterName: request.requester_name,
      requesterEmail: request.requester_email,
      requesterPicture: request.requester_picture,
      helperName: request.helper_name,
      createdAt: request.created_at,
      acceptedAt: request.accepted_at,
      completedAt: request.completed_at,
    };

    res.json(formattedRequest);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Failed to fetch request" });
  }
});

module.exports = router;
