import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  requesterName: string;
  requesterEmail: string;
  requesterPicture?: string;
  status: "open" | "in_progress" | "completed";
  createdAt: string;
}

const AcceptRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const savedRequests = JSON.parse(
      localStorage.getItem("helpRequests") || "[]"
    );
    // Filter out user's own requests and only show open requests
    const availableRequests = savedRequests.filter(
      (req: HelpRequest) =>
        req.requesterEmail !== user?.email && req.status === "open"
    );
    setRequests(availableRequests);
  };

  const handleAcceptRequest = (request: HelpRequest) => {
    // Update request status
    const savedRequests = JSON.parse(
      localStorage.getItem("helpRequests") || "[]"
    );
    const updatedRequests = savedRequests.map((req: HelpRequest) =>
      req.id === request.id
        ? {
            ...req,
            status: "in_progress",
            helperId: user?.id,
            helperName: user?.name,
          }
        : req
    );
    localStorage.setItem("helpRequests", JSON.stringify(updatedRequests));

    alert(
      `You've accepted "${request.title}". You can now contact ${request.requesterName}.`
    );
    loadRequests();
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case "high":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        };
      case "medium":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        };
      case "low":
        return {
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #6ee7b7",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          border: "1px solid #d1d5db",
        };
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🤝 Help Fellow Learners
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Browse help requests and share your knowledge to make a difference
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search for requests you can help with..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-gray-800 bg-white border-0 rounded-xl text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              style={{ color: "#1f2937" }}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Request Cards */}
        <div className="max-w-5xl mx-auto">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {requests.length === 0
                  ? "No help requests yet"
                  : "No requests match your search"}
              </h3>
              <p className="text-gray-600 text-lg max-w-md mx-auto">
                {requests.length === 0
                  ? "Be the first to post a help request! Click 'Send Request' to get started."
                  : "Try adjusting your search terms to find more requests."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {request.title}
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}>
                            {request.requesterName.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-700">
                            by {request.requesterName}
                          </span>
                        </div>

                        <span
                          className="px-3 py-1 rounded-full text-sm font-semibold"
                          style={getUrgencyStyle(request.urgency)}>
                          {request.urgency === "high" && "🔴"}
                          {request.urgency === "medium" && "🟡"}
                          {request.urgency === "low" && "🟢"}
                          {request.urgency} priority
                        </span>

                        {request.category && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                            📚 {request.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                      }}>
                      {request.requesterName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {request.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      📅 Posted{" "}
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                      style={{
                        background:
                          "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                      }}>
                      💪 Accept & Help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptRequest;
