import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import apiService from "../services/api";

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const SendRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
    urgency: "medium",
    estimatedDuration: "",
    location: "",
    isRemote: true,
    budgetMin: "",
    budgetMax: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Use fallback categories if API fails
      setCategories([
        {
          id: 1,
          name: "Programming",
          description: "Software development",
          icon: "code",
        },
        { id: 2, name: "Design", description: "UI/UX design", icon: "palette" },
        {
          id: 3,
          name: "Mathematics",
          description: "Math problems",
          icon: "calculator",
        },
        {
          id: 4,
          name: "Languages",
          description: "Language learning",
          icon: "globe",
        },
        { id: 5, name: "Writing", description: "Content writing", icon: "pen" },
        { id: 6, name: "Other", description: "Other subjects", icon: "help" },
      ]);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For now, save to localStorage since backend is not running
      const requestData = {
        id: Date.now().toString(),
        ...formData,
        categoryId: parseInt(formData.categoryId),
        skillsNeeded: skills,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : null,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : null,
        requesterName: user?.name,
        requesterEmail: user?.email,
        requesterPicture: user?.picture,
        status: "open",
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingRequests = JSON.parse(
        localStorage.getItem("helpRequests") || "[]"
      );
      existingRequests.push(requestData);
      localStorage.setItem("helpRequests", JSON.stringify(existingRequests));

      toast({
        title: "Success",
        description: "Your help request has been posted!",
      });

      navigate("/accept-request");
    } catch (error) {
      console.error("Failed to create request:", error);
      toast({
        title: "Error",
        description: "Failed to post your request. Please try again.",
        variant: "destructive",
      });
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
                  <Label>Category *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("categoryId", value)
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills Needed */}
                <div className="space-y-2">
                  <Label>Skills Needed</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeSkill(skill)}>
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
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

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 2 hours, 1 day, 1 week"
                    value={formData.estimatedDuration}
                    onChange={(e) =>
                      handleInputChange("estimatedDuration", e.target.value)
                    }
                  />
                </div>

                {/* Remote/Location */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="remote"
                      checked={formData.isRemote}
                      onCheckedChange={(checked) =>
                        handleInputChange("isRemote", checked)
                      }
                    />
                    <Label htmlFor="remote">Remote help is okay</Label>
                  </div>

                  {!formData.isRemote && (
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Where do you need help?"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <Label>Budget (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min $"
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) =>
                        handleInputChange("budgetMin", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Max $"
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) =>
                        handleInputChange("budgetMax", e.target.value)
                      }
                    />
                  </div>
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
