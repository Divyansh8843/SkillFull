import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import apiService from "../services/api";

const SendRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
  });

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
      // Send request to backend API
      const response = await apiService.createRequest({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        urgency: formData.urgency,
      });

      alert("Your help request has been posted!");
      navigate("/accept-request");
    } catch (error) {
      console.error("Failed to create request:", error);
      if (error.message.includes("validation")) {
        alert(
          "Please check your input. Description must be at least 10 characters long."
        );
      } else {
        alert("Failed to post your request. Please try again.");
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
      </div>
    </div>
  );
};

export default SendRequest;
