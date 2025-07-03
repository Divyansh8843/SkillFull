// Mock database service for development when MySQL is not available
const fs = require("fs").promises;
const path = require("path");

class MockDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, "..", "data");
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });

      // Initialize data files if they don't exist
      const files = {
        "users.json": [],
        "categories.json": [
          {
            id: 1,
            name: "Programming",
            description: "Software development, coding, debugging",
            icon: "code",
          },
          {
            id: 2,
            name: "Design",
            description: "UI/UX design, graphic design, web design",
            icon: "palette",
          },
          {
            id: 3,
            name: "Mathematics",
            description: "Algebra, calculus, statistics, problem solving",
            icon: "calculator",
          },
          {
            id: 4,
            name: "Languages",
            description:
              "Language learning, translation, conversation practice",
            icon: "globe",
          },
          {
            id: 5,
            name: "Writing",
            description: "Content writing, editing, proofreading",
            icon: "pen",
          },
          {
            id: 6,
            name: "Music",
            description: "Music theory, instrument lessons, composition",
            icon: "music",
          },
          {
            id: 7,
            name: "Business",
            description: "Marketing, finance, entrepreneurship",
            icon: "briefcase",
          },
          {
            id: 8,
            name: "Science",
            description: "Physics, chemistry, biology, research",
            icon: "flask",
          },
          {
            id: 9,
            name: "Technology",
            description: "Hardware, networking, cybersecurity",
            icon: "laptop",
          },
          {
            id: 10,
            name: "Arts & Crafts",
            description: "Drawing, painting, crafting, DIY projects",
            icon: "brush",
          },
        ],
        "help_requests.json": [],
        "messages.json": [],
        "reviews.json": [],
        "notifications.json": [],
      };

      for (const [filename, defaultData] of Object.entries(files)) {
        const filePath = path.join(this.dataDir, filename);
        try {
          await fs.access(filePath);
        } catch {
          await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
        }
      }
    } catch (error) {
      console.error("Error initializing mock database:", error);
    }
  }

  async readData(table) {
    try {
      const filePath = path.join(this.dataDir, `${table}.json`);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${table}:`, error);
      return [];
    }
  }

  async writeData(table, data) {
    try {
      const filePath = path.join(this.dataDir, `${table}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${table}:`, error);
      return false;
    }
  }

  // Simulate MySQL pool interface
  async execute(query, params = []) {
    // This is a very basic SQL parser for our specific use cases
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery.startsWith("select * from help_requests")) {
      const requests = await this.readData("help_requests");
      return [requests];
    }

    // Handle complex SELECT with JOINs for help requests
    if (
      lowerQuery.includes("from help_requests hr") &&
      lowerQuery.includes("left join")
    ) {
      const requests = await this.readData("help_requests");
      const categories = await this.readData("categories");
      const users = await this.readData("users");

      // Simulate the JOIN operation
      const joinedResults = requests.map((request) => {
        const category = categories.find((c) => c.id === request.category_id);
        const user = users.find((u) => u.id === request.requester_id);

        return {
          ...request,
          category_name: category ? category.name : null,
          requester_name: user ? user.name : "Test User",
          requester_email: user ? user.email : "test@example.com",
          requester_picture: user ? user.picture_url : null,
        };
      });

      // Apply WHERE conditions if any
      let filteredResults = joinedResults;

      // Filter by status if provided
      if (params.length > 0) {
        const status = params[0];
        filteredResults = filteredResults.filter((r) => r.status === status);
      }

      return [filteredResults];
    }

    if (lowerQuery.startsWith("insert into help_requests")) {
      const requests = await this.readData("help_requests");
      const newRequest = {
        id: requests.length + 1,
        requester_id: params[0],
        category_id: params[1],
        title: params[2],
        description: params[3],
        skills_needed: params[4] ? JSON.parse(params[4]) : [],
        urgency: params[5] || "medium",
        estimated_duration: params[6],
        location: params[7],
        is_remote: params[8] === 1 || params[8] === true,
        budget_min: params[9],
        budget_max: params[10],
        status: "open",
        helper_id: null,
        accepted_at: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      requests.push(newRequest);
      await this.writeData("help_requests", requests);
      return [{ insertId: newRequest.id }];
    }

    if (
      lowerQuery.includes("update help_requests") &&
      lowerQuery.includes("helper_id")
    ) {
      const requests = await this.readData("help_requests");
      const requestId = params[params.length - 1]; // Last parameter is usually the ID
      const helperId = params[0];

      const request = requests.find((r) => r.id == requestId);
      if (request) {
        request.helper_id = helperId;
        request.status = "in_progress";
        request.accepted_at = new Date().toISOString();
        request.updated_at = new Date().toISOString();
        await this.writeData("help_requests", requests);
      }
      return [{ affectedRows: request ? 1 : 0 }];
    }

    if (lowerQuery.startsWith("select * from users")) {
      const users = await this.readData("users");
      return [users];
    }

    if (
      lowerQuery.startsWith("insert into users") ||
      lowerQuery.includes("on duplicate key update")
    ) {
      const users = await this.readData("users");
      const userId = params[0];
      const existingUser = users.find((u) => u.id === userId);

      if (existingUser) {
        // Update existing user
        existingUser.email = params[1];
        existingUser.name = params[2];
        existingUser.picture_url = params[3];
        existingUser.updated_at = new Date().toISOString();
      } else {
        // Create new user
        const newUser = {
          id: userId,
          email: params[1],
          name: params[2],
          picture_url: params[3],
          bio: null,
          skills: [],
          rating: 0.0,
          total_reviews: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        users.push(newUser);
      }
      await this.writeData("users", users);
      return [{ insertId: userId }];
    }

    if (lowerQuery.startsWith("select * from categories")) {
      const categories = await this.readData("categories");
      return [categories];
    }

    // Default return for unhandled queries
    return [[]];
  }

  async getConnection() {
    return {
      execute: this.execute.bind(this),
      release: () => {},
    };
  }
}

// Check if MySQL is available, if not use mock database
async function createDatabaseConnection() {
  try {
    const mysql = require("mysql2/promise");
    require("dotenv").config();

    const dbConfig = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "skillwave_db",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    };

    const pool = mysql.createPool(dbConfig);

    // Test connection
    const connection = await pool.getConnection();
    console.log("Database connected successfully (MySQL)");
    connection.release();

    return pool;
  } catch (error) {
    console.log("MySQL not available, using mock database for development");
    return new MockDatabase();
  }
}

module.exports = createDatabaseConnection();
