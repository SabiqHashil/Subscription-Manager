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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SubscriptionDialog({ open, onClose, subscription }) {
  const isEditing = !!subscription;

  const [formData, setFormData] = useState({
    client_name: "",
    business_name: "",
    client_email: "",
    client_phone: "",
    price: "",
    paid_date: "",
    renewal_date: "",
    duration: "1 Year",
    type: "Client",
    category: "Domain",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [paidDate, setPaidDate] = useState(null);
  const [renewalDate, setRenewalDate] = useState(null);

  useEffect(() => {
    if (subscription) {
      setFormData({
        client_name: subscription.client_name || "",
        business_name: subscription.business_name || "",
        client_email: subscription.client_email || "",
        client_phone: subscription.client_phone || "",
        price: subscription.price?.toString() || "",
        paid_date: subscription.paid_date || "",
        renewal_date: subscription.renewal_date || "",
        duration: subscription.duration || "1 Year",
        type: subscription.type || "Client",
        category: subscription.category || "Domain",
        notes: subscription.notes || "",
      });
      if (subscription.paid_date) {
        setPaidDate(new Date(subscription.paid_date));
      }
      if (subscription.renewal_date) {
        setRenewalDate(new Date(subscription.renewal_date));
      }
    } else {
      setFormData({
        client_name: "",
        business_name: "",
        client_email: "",
        client_phone: "",
        price: "",
        paid_date: "",
        renewal_date: "",
        duration: "1 Year",
        type: "Client",
        category: "Domain",
        notes: "",
      });
      setPaidDate(null);
      setRenewalDate(null);
    }
  }, [subscription, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.client_name ||
      !formData.business_name ||
      !formData.price ||
      !formData.paid_date ||
      !formData.renewal_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (isEditing) {
        await axios.put(`${API}/subscriptions/${subscription.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Subscription updated successfully");
      } else {
        await axios.post(`${API}/subscriptions`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Subscription created successfully");
      }

      onClose(true);
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error(
        error.response?.data?.detail || "Failed to save subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        data-testid="subscription-dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Subscription" : "Add New Subscription"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update subscription details"
              : "Fill in the details to create a new subscription"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleChange("client_name", e.target.value)}
                placeholder="John Doe"
                data-testid="client-name-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name *</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                placeholder="ABC Company"
                data-testid="business-name-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => handleChange("client_email", e.target.value)}
                placeholder="client@example.com"
                data-testid="client-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_phone">Client Phone Number</Label>
              <Input
                id="client_phone"
                type="tel"
                value={formData.client_phone}
                onChange={(e) => handleChange("client_phone", e.target.value)}
                placeholder="9876543210"
                data-testid="client-phone-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="1000"
                data-testid="price-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleChange("duration", value)}
              >
                <SelectTrigger data-testid="duration-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="1 Year">1 Year</SelectItem>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paid_date">Paid Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    data-testid="paid-date-button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {paidDate ? format(paidDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={paidDate}
                    onSelect={(date) => {
                      setPaidDate(date);
                      handleChange(
                        "paid_date",
                        date ? format(date, "yyyy-MM-dd") : ""
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewal_date">Renewal Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    data-testid="renewal-date-button"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {renewalDate ? format(renewalDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={renewalDate}
                    onSelect={(date) => {
                      setRenewalDate(date);
                      handleChange(
                        "renewal_date",
                        date ? format(date, "yyyy-MM-dd") : ""
                      );
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger data-testid="type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Official">Official</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger data-testid="category-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Domain">Domain</SelectItem>
                  <SelectItem value="Hosting Platform">
                    Hosting Platform
                  </SelectItem>
                  <SelectItem value="WhatsApp API">WhatsApp API</SelectItem>
                  <SelectItem value="SSL">SSL</SelectItem>
                  <SelectItem value="Cloud Service">Cloud Service</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional information..."
              rows={3}
              data-testid="notes-input"
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
