import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import apiService from "../services/api";

const SendRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [loadingMyRequests, setLoadingMyRequests] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
  });

  // Load user's previous requests
  useEffect(() => {
    loadMyRequests();
  }, [user]);

  const loadMyRequests = async () => {
    if (!user) return;

    try {
      setLoadingMyRequests(true);
      const allRequests = await apiService.getRequests();

      // Filter requests by current user's email
      const userRequests = allRequests.filter(
        (req) => req.requesterEmail === user.email
      );

      setMyRequests(userRequests);
    } catch (error) {
      console.error("Failed to load user requests:", error);
    } finally {
      setLoadingMyRequests(false);
    }
  };

  const categories = [
    { id: 1, name: "Programming" },
    { id: 2, name: "Design" },
    { id: 3, name: "Mathematics" },
    { id: 4, name: "Languages" },
    { id: 5, name: "Writing" },
    { id: 6, name: "Other" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.description.length < 10) {
      alert("Description must be at least 10 characters long");
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting request with data:", formData);

      // Send request to backend API
      const response = await apiService.createRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
        requesterName: user?.name || "Anonymous",
        requesterEmail: user?.email || "anonymous@example.com",
        requesterPicture: user?.picture || null,
      });

      console.log("Request created successfully:", response);
      alert("Your help request has been posted!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        urgency: "medium",
      });

      // Refresh user's requests
      loadMyRequests();

      // Navigate to accept request page
      navigate("/accept-request");
    } catch (error) {
      console.error("Failed to create request:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });

      if (error.message.includes("validation")) {
        alert(
          "Please check your input. Description must be at least 10 characters long."
        );
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        alert(
          "Cannot connect to server. Please make sure the backend is running on http://localhost:3001"
        );
      } else {
        alert(`Failed to post your request: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📝 Post a Help Request
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Get the help you need from fellow students and tutors
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              What do you need help with?
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Fill out the details below to connect with the right helper
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Help with React components, Math homework..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  style={{ color: "#1f2937", backgroundColor: "#f9fafb" }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Description * (minimum 10 characters)
                </label>
                <textarea
                  placeholder="Describe what you need help with in detail... (minimum 10 characters)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                  rows={4}
                  className={`w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 rounded-lg text-lg focus:outline-none focus:bg-white transition-all resize-none ${
                    formData.description.length > 0 &&
                    formData.description.length < 10
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  style={{ color: "#1f2937", backgroundColor: "#f9fafb" }}
                />
                <div className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/10 characters minimum
                  {formData.description.length > 0 &&
                    formData.description.length < 10 && (
                      <span className="text-red-500 ml-2">
                        Need {10 - formData.description.length} more characters
                      </span>
                    )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Subject Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  style={{ color: "#1f2937", backgroundColor: "#f9fafb" }}>
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                      style={{ color: "#1f2937" }}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  How urgent is this?
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange("urgency", e.target.value)}
                  className="w-full px-4 py-3 text-gray-800 bg-gray-50 border-2 border-gray-300 rounded-lg text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  style={{ color: "#1f2937", backgroundColor: "#f9fafb" }}>
                  <option value="low" style={{ color: "#1f2937" }}>
                    🟢 Low - I can wait a few days
                  </option>
                  <option value="medium" style={{ color: "#1f2937" }}>
                    🟡 Medium - Within this week
                  </option>
                  <option value="high" style={{ color: "#1f2937" }}>
                    🔴 High - I need help urgently
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-lg font-bold text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Posting Request...
                  </span>
                ) : (
                  "🚀 Post My Request"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* My Previous Requests Section */}
        {user && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📋 My Previous Requests
              </h2>

              {loadingMyRequests ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your requests...</p>
                </div>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">
                    You haven't posted any requests yet. Submit your first
                    request above! 🚀
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {request.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === "open"
                                ? "bg-green-100 text-green-800"
                                : request.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {request.status === "open"
                              ? "🟢 Open"
                              : request.status === "in_progress"
                              ? "🟡 In Progress"
                              : "✅ Completed"}
                          </span>
                          {request.urgency && (
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                request.urgency === "high"
                                  ? "bg-red-100 text-red-700"
                                  : request.urgency === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                              {request.urgency === "high" && "🔴"}
                              {request.urgency === "medium" && "🟡"}
                              {request.urgency === "low" && "🟢"}{" "}
                              {request.urgency}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {request.description}
                      </p>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          {request.category && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              📚 {request.category}
                            </span>
                          )}
                          <span>
                            📅{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          ID: {request.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendRequest;
