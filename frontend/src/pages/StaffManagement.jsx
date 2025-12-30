import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import StaffTable from "@/components/StaffTable";
import StaffDialog from "@/components/StaffDialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingStaff(null);
    setDialogOpen(true);
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Staff member deleted successfully");
      fetchStaff();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error("Failed to delete staff member");
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setEditingStaff(null);
    if (refresh) {
      fetchStaff();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading staff members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="staff-management-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Staff Management
          </h1>
          <p className="text-slate-600">
            Manage staff accounts and permissions
          </p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          data-testid="add-staff-button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <StaffTable staff={staff} onEdit={handleEdit} onDelete={handleDelete} />

      <StaffDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        staff={editingStaff}
      />
    </div>
  );
}
