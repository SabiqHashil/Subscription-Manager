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

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function StaffDialog({ open, onClose, staff, readOnly = false }) {
  const isEditing = !!staff;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
    permissions: {
      subscriptions_view: true,
      subscriptions_create: false,
      subscriptions_edit: false,
      subscriptions_delete: false,
      staff_manage: false,
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        password: "",
        role: staff.role || "staff",
        permissions: staff.permissions || {
          subscriptions_view: true,
          subscriptions_create: false,
          subscriptions_edit: false,
          subscriptions_delete: false,
          staff_manage: false,
        },
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "staff",
        permissions: {
          subscriptions_view: true,
          subscriptions_create: false,
          subscriptions_edit: false,
          subscriptions_delete: false,
          staff_manage: false,
        },
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
        role: formData.role,
        permissions: formData.permissions,
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
            {readOnly ? "Staff Details" : (isEditing ? "Edit Staff Member" : "Add New Staff Member")}
          </DialogTitle>
          <DialogDescription>
            {readOnly ? "View staff member information" : (isEditing
              ? "Update staff member details and permissions"
              : "Create a new staff account")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Staff Name</Label>
            <div className={readOnly ? "text-sm p-2 bg-slate-50 border rounded-md text-slate-700" : ""}>
              {readOnly ? formData.name : (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                  data-testid="staff-name-input"
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className={readOnly ? "text-sm p-2 bg-slate-50 border rounded-md text-slate-700" : ""}>
              {readOnly ? formData.email : (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  data-testid="staff-email-input"
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className={readOnly ? "text-sm p-2 bg-slate-50 border rounded-md text-slate-700" : ""}>
              {readOnly ? formData.phone : (
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="9999999999"
                  data-testid="staff-phone-input"
                  required
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              {readOnly ? (
                <div className="text-sm p-1.5 bg-slate-50 border rounded-md text-slate-700">
                  {formData.role === "admin" ? "Administrator" : "Staff Member"}
                </div>
              ) : (
                <select
                  id="role"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  required
                >
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Label className="text-base font-semibold">Permissions (Access Control)</Label>
              <div className="grid grid-cols-1 gap-2 border rounded-md p-3 bg-slate-50/30">
                {[
                  { id: "subscriptions_view", label: "View Subscriptions" },
                  { id: "subscriptions_create", label: "Add New Subscriptions" },
                  { id: "subscriptions_edit", label: "Edit Subscriptions" },
                  { id: "subscriptions_delete", label: "Delete Subscriptions" },
                  { id: "staff_manage", label: "Manage Staff & Admins" },
                ].map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={perm.id}
                      checked={formData.role === "admin" ? true : formData.permissions[perm.id]}
                      onChange={(e) => {
                        const newPerms = { ...formData.permissions, [perm.id]: e.target.checked };
                        handleChange("permissions", newPerms);
                      }}
                      disabled={readOnly || formData.role === "admin"}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <Label
                      htmlFor={perm.id}
                      className={`text-sm font-normal cursor-pointer ${formData.role === "admin" ? "text-slate-400" : "text-slate-700 hover:text-indigo-600 transition-colors"
                        }`}
                    >
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.role === "admin" && !readOnly && (
                <p className="text-[11px] text-amber-600 font-medium italic">
                  * Administrators have all permissions granted by default.
                </p>
              )}
            </div>
          </div>

          {readOnly && staff && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Created Date</Label>
                <div className="text-sm p-2 bg-slate-50 border rounded-md text-slate-700">
                  {formatDate(staff.created_at)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Updated Date</Label>
                <div className="text-sm p-2 bg-slate-50 border rounded-md text-slate-700">
                  {formatDate(staff.updated_at || staff.created_at)}
                </div>
              </div>
            </div>
          )}

          {!readOnly && (
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
          )}

          {!readOnly && (
            <DialogFooter className="pt-4">
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
          )}
          {readOnly && (
            <DialogFooter className="pt-4">
              <Button type="button" onClick={() => onClose(false)} className="w-full">Close</Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
