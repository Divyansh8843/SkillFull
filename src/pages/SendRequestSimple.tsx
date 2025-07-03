import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

    setLoading(true);
    try {
      // Save to localStorage for now
      const requestData = {
        id: Date.now().toString(),
        ...formData,
        requesterName: user?.name,
        requesterEmail: user?.email,
        requesterPicture: user?.picture,
        status: "open",
        createdAt: new Date().toISOString(),
      };

      const existingRequests = JSON.parse(
        localStorage.getItem("helpRequests") || "[]"
      );
      existingRequests.push(requestData);
      localStorage.setItem("helpRequests", JSON.stringify(existingRequests));

      alert("Your help request has been posted!");
      navigate("/accept-request");
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Failed to post your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <Navigation />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Post a Help Request
              </CardTitle>
              <CardDescription className="text-center">
                Describe what you need help with and connect with skilled peers
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What do you need help with?"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide more details about your request..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("urgency", value)
                    }
                    defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Can wait</SelectItem>
                      <SelectItem value="medium">
                        Medium - Within a week
                      </SelectItem>
                      <SelectItem value="high">High - Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Posting..." : "Post Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SendRequest;
