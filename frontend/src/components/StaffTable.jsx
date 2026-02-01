import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Mail, Phone, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function StaffTable({ staff, canManage, onEdit, onDelete, onView }) {
  const [deleteId, setDeleteId] = useState(null);

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <p className="text-slate-600">No staff members found</p>
      </div>
    );
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
      data-testid="staff-table"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">
                Staff Name
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Email
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Phone
              </TableHead>
              <TableHead className="font-semibold text-slate-900">
                Role
              </TableHead>
              <TableHead className="font-semibold text-slate-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow
                key={member.id}
                className="hover:bg-slate-50"
                data-testid={`staff-row-${member.id}`}
              >
                <TableCell className="font-medium text-slate-900">
                  {member.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {member.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {member.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={member.role === 'admin' ? "bg-purple-100 text-purple-800 border-purple-300" : "bg-blue-100 text-blue-800 border-blue-300"}>
                    {member.role === 'admin' ? 'Administrator' : 'Staff Member'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(member)}
                      className="text-slate-600 hover:text-slate-900"
                      data-testid={`view-button-${member.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {canManage && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(member)}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          data-testid={`edit-button-${member.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(member.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          data-testid={`delete-button-${member.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff member"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
