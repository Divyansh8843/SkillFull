import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MapPin, Clock, DollarSign, User, MessageCircle } from "lucide-react";
import RequestFeed from "../components/RequestFeed";

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  categoryId: number;
  skillsNeeded: string[];
  urgency: "low" | "medium" | "high";
  estimatedDuration: string;
  location: string;
  isRemote: boolean;
  budgetMin?: number;
  budgetMax?: number;
  requesterName: string;
  requesterEmail: string;
  requesterPicture?: string;
  status: "open" | "in_progress" | "completed";
  createdAt: string;
}

interface Message {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

const AcceptRequest = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<HelpRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    urgency: "",
    remote: "",
  });

  const categories = [
    { id: 1, name: "Programming" },
    { id: 2, name: "Design" },
    { id: 3, name: "Mathematics" },
    { id: 4, name: "Languages" },
    { id: 5, name: "Writing" },
    { id: 6, name: "Other" },
  ];

  useEffect(() => {
    loadRequests();
    loadMessages();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, filters]);

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

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    setMessages(savedMessages);
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.title.toLowerCase().includes(searchLower) ||
          req.description.toLowerCase().includes(searchLower) ||
          req.skillsNeeded.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          )
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (req) => req.categoryId.toString() === filters.category
      );
    }

    if (filters.urgency) {
      filtered = filtered.filter((req) => req.urgency === filters.urgency);
    }

    if (filters.remote) {
      if (filters.remote === "remote") {
        filtered = filtered.filter((req) => req.isRemote);
      } else if (filters.remote === "local") {
        filtered = filtered.filter((req) => !req.isRemote);
      }
    }

    setFilteredRequests(filtered);
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
            acceptedAt: new Date().toISOString(),
          }
        : req
    );
    localStorage.setItem("helpRequests", JSON.stringify(updatedRequests));

    toast({
      title: "Request Accepted!",
      description: `You've accepted "${request.title}". You can now message ${request.requesterName}.`,
    });

    loadRequests();
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedRequest) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      requestId: selectedRequest.id,
      senderId: user?.id || "",
      senderName: user?.name || "",
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    const savedMessages = JSON.parse(localStorage.getItem("messages") || "[]");
    savedMessages.push(newMessage);
    localStorage.setItem("messages", JSON.stringify(savedMessages));

    setMessages([...messages, newMessage]);
    setMessageText("");

    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedRequest.requesterName}.`,
    });
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

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `$${min} - $${max}`;
    if (min) return `$${min}+`;
    if (max) return `Up to $${max}`;
    return null;
  };

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

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search requests..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                  />

                  <Select
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, urgency: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="All Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Urgency</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, remote: value }))
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="remote">Remote Only</SelectItem>
                      <SelectItem value="local">Local Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Request Cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  No requests found matching your filters.
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
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{request.requesterName}</span>
                        </div>
                        <Badge className={getUrgencyColor(request.urgency)}>
                          {request.urgency} priority
                        </Badge>
                        {request.isRemote && (
                          <Badge variant="outline">Remote OK</Badge>
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

                  {request.skillsNeeded.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Skills Needed:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {request.skillsNeeded.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {request.estimatedDuration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{request.estimatedDuration}</span>
                      </div>
                    )}

                    {!request.isRemote && request.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{request.location}</span>
                      </div>
                    )}

                    {formatBudget(request.budgetMin, request.budgetMax) && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          {formatBudget(request.budgetMin, request.budgetMax)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptRequest(request)}
                      className="flex-1">
                      Accept Request
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowMessageDialog(true);
                      }}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Send Message to {selectedRequest?.requesterName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {messages
                .filter((msg) => msg.requestId === selectedRequest?.id)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.senderId === user?.id
                        ? "bg-blue-100 ml-auto max-w-[80%]"
                        : "bg-gray-100 mr-auto max-w-[80%]"
                    }`}>
                    <p className="text-sm font-medium">{msg.senderName}</p>
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AcceptRequest;
