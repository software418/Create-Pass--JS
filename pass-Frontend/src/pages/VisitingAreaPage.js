import { jsx as _jsx } from "react/jsx-runtime";
import DynamicDataPage from "@/master/Dynamic";
import { useVisitorArea } from "@/features/visitor_area/useVisitorArea";
export const VisitorAreaPage = () => {
  const { visitorArea, isLoading, error, onCreate, onUpdate, onDelete } =
    useVisitorArea(); // your hook
  return _jsx(DynamicDataPage, {
    title: "Visiting Area",
    subtitle: "Area to Visit",
    data: visitorArea,
    idKey: "_id",
    columns: [
      { key: "name", label: "Full Name", sortable: true },
      { key: "floor", label: "Floor" },
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
        key: "floor",
        label: "Floor",
        placeholder: "Floor",
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
