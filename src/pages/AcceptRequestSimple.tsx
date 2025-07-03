import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Available Help Requests
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Find requests that match your skills and help fellow learners
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-8">
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Request Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  {requests.length === 0
                    ? "No help requests available at the moment."
                    : "No requests found matching your search."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {request.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>By {request.requesterName}</span>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency} priority
                        </Badge>
                        {request.category && (
                          <Badge variant="outline">{request.category}</Badge>
                        )}
                      </div>
                    </div>
                    <Avatar>
                      <AvatarImage src={request.requesterPicture} />
                      <AvatarFallback>
                        {request.requesterName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 mb-4">{request.description}</p>

                  <div className="text-sm text-gray-500 mb-4">
                    Posted {new Date(request.createdAt).toLocaleDateString()}
                  </div>

                  <Button
                    onClick={() => handleAcceptRequest(request)}
                    className="w-full">
                    Accept Request
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptRequest;
