// Simple database configuration with mock fallback
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
            name: "Other",
            description: "Miscellaneous help requests",
            icon: "help",
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

  async readData(tableName) {
    try {
      const filePath = path.join(this.dataDir, `${tableName}.json`);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${tableName}:`, error);
      return [];
    }
  }

  async writeData(tableName, data) {
    try {
      const filePath = path.join(this.dataDir, `${tableName}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${tableName}:`, error);
      return false;
    }
  }

  async execute(query, params = []) {
    const lowerQuery = query.toLowerCase().trim();

    // Handle SELECT 1 for health checks
    if (lowerQuery === "select 1") {
      return [{ 1: 1 }];
    }

    // Handle help requests queries
    if (lowerQuery.includes("help_requests")) {
      if (lowerQuery.startsWith("insert into help_requests")) {
        const helpRequests = await this.readData("help_requests");
        const newId = Math.max(...helpRequests.map((r) => r.id || 0), 0) + 1;

        const newRequest = {
          id: newId,
          requester_id: params[0] || "test-user-1",
          category_id: params[1],
          title: params[2],
          description: params[3],
          skills_needed: params[4],
          urgency: params[5] || "medium",
          estimated_duration: params[6],
          location: params[7],
          is_remote: params[8] !== false,
          budget_min: params[9],
          budget_max: params[10],
          requester_name: params[11] || "Anonymous",
          requester_email: params[12] || "anonymous@example.com",
          requester_picture: params[13] || null,
          status: "open",
          created_at: new Date().toISOString(),
          accepted_at: null,
          completed_at: null,
        };

        helpRequests.push(newRequest);
        await this.writeData("help_requests", helpRequests);

        return { insertId: newId };
      }

      if (
        lowerQuery.includes("select") &&
        lowerQuery.includes("from help_requests")
      ) {
        const helpRequests = await this.readData("help_requests");
        const categories = await this.readData("categories");

        // Create mock user data for the requester
        const mockUser = {
          id: "test-user-1",
          name: "Test User",
          email: "test@example.com",
          picture_url: "https://via.placeholder.com/150",
        };

        // Handle SELECT * FROM help_requests WHERE id = ? query
        if (lowerQuery.includes("where id =") && params.length > 0) {
          const requestId = params[0];
          const request = helpRequests.find((req) => req.id == requestId);
          if (!request) return [];

          const category = categories.find((c) => c.id === request.category_id);
          return [
            {
              ...request,
              category_name: category ? category.name : null,
              // Use stored user data instead of mock data
              requester_name: request.requester_name || "Anonymous",
              requester_email:
                request.requester_email || "anonymous@example.com",
              requester_picture: request.requester_picture || null,
            },
          ];
        }

        // Filter by status if specified in params
        const statusFilter = params[0] || "open";
        const filteredRequests = helpRequests.filter(
          (req) => req.status === statusFilter
        );

        // Simulate JOIN with categories and users
        const requestsWithJoins = filteredRequests.map((request) => {
          const category = categories.find((c) => c.id === request.category_id);

          return {
            id: request.id,
            title: request.title,
            description: request.description,
            urgency: request.urgency,
            estimated_duration: request.estimated_duration,
            location: request.location,
            is_remote: request.is_remote,
            budget_min: request.budget_min,
            budget_max: request.budget_max,
            skills_needed: request.skills_needed,
            status: request.status,
            created_at: request.created_at,
            accepted_at: request.accepted_at,
            completed_at: request.completed_at,
            requester_id: request.requester_id,
            category_id: request.category_id,
            // Use stored user data instead of mock data
            category_name: category ? category.name : null,
            requester_name: request.requester_name || "Anonymous",
            requester_email: request.requester_email || "anonymous@example.com",
            requester_picture: request.requester_picture || null,
          };
        });

        return requestsWithJoins;
      }

      if (lowerQuery.startsWith("update help_requests")) {
        const helpRequests = await this.readData("help_requests");

        // Extract request ID from params (last parameter)
        const requestId = params[params.length - 1];
        const helperId = params[0] || "test-helper-1";

        // Find and update the request
        const updatedRequests = helpRequests.map((req) => {
          if (req.id == requestId) {
            return {
              ...req,
              status: "in_progress",
              helper_id: helperId,
              accepted_at: new Date().toISOString(),
            };
          }
          return req;
        });

        await this.writeData("help_requests", updatedRequests);
        return { affectedRows: 1 };
      }
    }

    // Handle categories queries
    if (lowerQuery.includes("categories")) {
      if (lowerQuery.startsWith("select id from categories")) {
        const categories = await this.readData("categories");
        const categoryName = params[0];
        const found = categories.find((c) => c.name === categoryName);
        return found ? [{ id: found.id }] : [];
      }

      if (lowerQuery.startsWith("insert into categories")) {
        const categories = await this.readData("categories");
        const newId = Math.max(...categories.map((c) => c.id || 0), 0) + 1;

        const newCategory = {
          id: newId,
          name: params[0],
          description: params[1],
        };

        categories.push(newCategory);
        await this.writeData("categories", categories);

        return { insertId: newId };
      }

      if (lowerQuery.startsWith("select * from categories")) {
        const categories = await this.readData("categories");
        return categories;
      }
    }

    // Default return for unhandled queries
    return [];
  }

  async getConnection() {
    return {
      execute: this.execute.bind(this),
      release: () => {},
    };
  }
}

// Initialize mock database
const mockDb = new MockDatabase();

// Create unified interface
const database = {
  executeQuery: mockDb.execute.bind(mockDb),
  execute: mockDb.execute.bind(mockDb),
  getConnection: mockDb.getConnection.bind(mockDb),
  testConnection: async () => true,
};

console.log("Using mock database for development");

module.exports = database;
