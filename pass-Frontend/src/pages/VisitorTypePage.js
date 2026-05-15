import { jsx as _jsx } from "react/jsx-runtime";
import DynamicDataPage from "@/master/Dynamic";
import { useVisitorType } from "@/features/visitor_type/useVisitorType";
export const VisitorTypePage = () => {
  const { visitorType, isLoading, error, onCreate, onUpdate, onDelete } =
    useVisitorType(); // your hook
  return _jsx(DynamicDataPage, {
    title: "Visitor Type",
    subtitle: "Type Of Visitor",
    data: visitorType,
    idKey: "_id",
    columns: [
      { key: "name", label: "Full Name", sortable: true },
      { key: "description", label: "Description" },
      { key: "status", label: "Status", type: "status" },
    ],
    isLoading: isLoading,
    error: error,
    onCreate: onCreate,
    onEdit: onUpdate,
    onDelete: onDelete,
    formFields: [
      {
        key: "name",
        label: "Item Name",
        required: true,
        placeholder: "Mobile",
      },
      {
        key: "description",
        label: "Description",
        required: true,
        placeholder: "Tech tool",
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["active", "blocked", "deleted"],
        defaultValue: "active",
      },
    ],
  });
};
