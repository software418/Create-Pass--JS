import { useState, useEffect, useMemo } from "react";
import DynamicDataPage from "@/master/Dynamic";
import { useDepartment } from "@/features/department/useDepartment";
import api from "@/shared/services/api";

export const DepartmentPage = () => {
  const { department, isLoading, error, onCreate, onUpdate, onDelete } = useDepartment();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/auth/users").then((res) => {
      setUsers(res.data.data.users);
    }).catch(console.error);
  }, []);

  const userOptions = useMemo(() => {
    return users.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));
  }, [users]);

  return (
    <DynamicDataPage
      title="Department"
      subtitle="Manage departments and assign managers for smart routing"
      data={department.map(d => ({
        ...d,
        managerName: users.find(u => u.id === d.managerUserId)?.name || "—"
      }))}
      idKey="_id"
      columns={[
        { key: "name", label: "Department Name", sortable: true },
        { key: "managerName", label: "Department Manager", sortable: true },
        { key: "status", label: "Status", type: "status" },
      ]}
      isLoading={isLoading}
      error={error}
      onCreate={onCreate}
      onEdit={onUpdate}
      onDelete={onDelete}
      formFields={[
        {
          key: "name",
          label: "Department Name",
          required: true,
          placeholder: "Department",
        },
        {
          key: "managerUserId",
          label: "Department Manager",
          type: "select",
          options: userOptions,
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: ["active", "blocked", "deleted"],
          defaultValue: "active",
        },
      ]}
    />
  );
};
