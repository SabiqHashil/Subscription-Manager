import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Search, Filter } from "lucide-react";
import SubscriptionTable from "@/components/SubscriptionTable";
import SubscriptionDialog from "@/components/SubscriptionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { hasPermission } from "@/utils/permissions";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Subscriptions({ user }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingSubscription, setViewingSubscription] = useState(null);

  const canCreate = hasPermission(user, "subscriptions_create");
  const canEdit = hasPermission(user, "subscriptions_edit");
  const canDelete = hasPermission(user, "subscriptions_delete");
  const canView = hasPermission(user, "subscriptions_view");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, filterType, filterCategory, filterStatus]);

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/subscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.business_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((sub) => sub.type === filterType);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((sub) => sub.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((sub) => sub.status === filterStatus);
    }

    // Sort by renewal date (nearest first)
    filtered.sort(
      (a, b) => new Date(a.renewal_date) - new Date(b.renewal_date)
    );

    setFilteredSubscriptions(filtered);
  };

  const handleAddNew = () => {
    setEditingSubscription(null);
    setDialogOpen(true);
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setDialogOpen(true);
  };

  const handleView = (subscription) => {
    setViewingSubscription(subscription);
    setViewOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/subscriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subscription deleted successfully");
      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Failed to delete subscription");
    }
  };

  const handleDialogClose = (refresh = false) => {
    setDialogOpen(false);
    setEditingSubscription(null);
    if (refresh) {
      fetchSubscriptions();
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewingSubscription(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-600">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="subscriptions-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Subscriptions
          </h1>
          <p className="text-slate-600">
            {canCreate
              ? "Manage all client subscriptions"
              : "View all subscriptions"}
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            data-testid="add-subscription-button"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-900">Filters & Search</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-slate-300"
              data-testid="search-input"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger
              className="border-slate-300"
              data-testid="type-filter"
            >
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Client">Client</SelectItem>
              <SelectItem value="Official">Official</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger
              className="border-slate-300"
              data-testid="category-filter"
            >
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Domain">Domain</SelectItem>
              <SelectItem value="Hosting Platform">Hosting Platform</SelectItem>
              <SelectItem value="WhatsApp API">WhatsApp API</SelectItem>
              <SelectItem value="SSL">SSL</SelectItem>
              <SelectItem value="Cloud Service">Cloud Service</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className="border-slate-300"
              data-testid="status-filter"
            >
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <SubscriptionTable
        subscriptions={filteredSubscriptions}
        canEdit={canEdit}
        canDelete={canDelete}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Add/Edit Dialog */}
      {canCreate || canEdit ? (
        <SubscriptionDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          subscription={editingSubscription}
        />
      ) : null}

      <SubscriptionDialog
        open={viewOpen}
        onClose={handleViewClose}
        subscription={viewingSubscription}
        readOnly={true}
      />
    </div>
  );
}
