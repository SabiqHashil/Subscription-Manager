import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Active":
      return "bg-green-100 text-green-800 border-green-300";
    case "Expiring Soon":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Expiring Today":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Expired":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

export default function SubscriptionTable({
  subscriptions,
  isAdmin,
  onEdit,
  onDelete,
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No subscriptions found</p>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
      data-testid="subscriptions-table"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">
                Client Name
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Business Name
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Email
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Category
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Type
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Renewal Date
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Price
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow
                key={sub.id}
                className="hover:bg-slate-50"
                data-testid={`subscription-row-${sub.id}`}
              >
                <TableCell className="font-medium text-slate-900">
                  {sub.client_name}
                </TableCell>
                <TableCell className="text-slate-700">
                  {sub.business_name}
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  {sub.client_email || "-"}
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  {sub.client_phone || "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-slate-300 text-slate-700"
                  >
                    {sub.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-slate-300 text-slate-700"
                  >
                    {sub.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">
                  {formatDate(sub.renewal_date)}
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  {formatCurrency(sub.price)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(sub.status)}
                    data-testid={`status-${sub.id}`}
                  >
                    {sub.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">
                  {sub.notes || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isAdmin ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(sub)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          data-testid={`edit-button-${sub.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(sub.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-button-${sub.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600"
                        data-testid={`view-button-${sub.id}`}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
