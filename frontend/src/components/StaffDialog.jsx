import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function StaffDialog({ open, onClose, staff }) {
  const isEditing = !!staff;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        password: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  }, [staff, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error("Password is required for new staff");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEditing) {
        await axios.put(`${API}/staff/${staff.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Staff member updated successfully");
      } else {
        payload.role = "staff";
        await axios.post(`${API}/auth/register`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Staff member created successfully");
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error(
        error.response?.data?.detail || "Failed to save staff member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-md" data-testid="staff-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update staff member details"
              : "Fill in the details to create a new staff account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
              data-testid="staff-name-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              data-testid="staff-email-input"
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="9999999999"
              data-testid="staff-phone-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password {isEditing ? "(Leave blank to keep unchanged)" : "*"}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter password"
              data-testid="staff-password-input"
              required={!isEditing}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              data-testid="cancel-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
              data-testid="submit-button"
            >
              {loading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
