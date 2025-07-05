// Demo data for production
export const initializeDemoData = () => {
  if (!localStorage.getItem("helpRequests")) {
    const demoRequests = [
      {
        id: 1,
        title: "Need Help with React Hooks",
        description:
          "I'm struggling to understand how useState and useEffect work together in React. Can someone help me with a practical example?",
        category: "Programming",
        urgency: "medium",
        requesterName: "Sarah Johnson",
        requesterEmail: "sarah.j@example.com",
        requesterPicture:
          "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150",
        status: "open",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: 2,
        title: "Python Data Analysis Project",
        description:
          "Working on a data analysis project using pandas and matplotlib. Need help with data visualization and cleaning techniques.",
        category: "Programming",
        urgency: "high",
        requesterName: "Mike Chen",
        requesterEmail: "mike.chen@example.com",
        requesterPicture:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        status: "open",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      },
      {
        id: 3,
        title: "JavaScript Async/Await Confusion",
        description:
          "I keep getting confused about when to use async/await vs Promises. Could use some guidance on best practices.",
        category: "Programming",
        urgency: "low",
        requesterName: "Emma Davis",
        requesterEmail: "emma.davis@example.com",
        requesterPicture:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        status: "open",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      },
    ];

    localStorage.setItem("helpRequests", JSON.stringify(demoRequests));
  }
};
