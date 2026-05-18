import { useMemo } from "react";
import DynamicDataPage from "@/master/Dynamic";
import { useEmployees } from "@/features/employee/useEmployee";
import { useDepartment } from "@/features/department/useDepartment";

export const EmployeePage = () => {
  const { employees, isLoading, error, onCreate, onUpdate, onDelete } =
    useEmployees();
  const {
    department: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useDepartment();

  const departmentOptions = useMemo(() => {
    const fromMaster = departments
      .filter((d) => d.status === "active" || !d.status)
      .map((d) => d.name);
    const fromEmployees = employees.map((e) => e.department);
    return [...new Set([...fromMaster, ...fromEmployees].filter(Boolean))].sort(
      (a, b) => a.localeCompare(b),
    );
  }, [departments, employees]);

  const formFields = useMemo(
    () => [
      {
        key: "name",
        label: "Full Name",
        required: true,
        placeholder: "Jane Doe",
      },
      {
        key: "employeeId",
        label: "Employee ID",
        required: true,
        placeholder: "EMP-001",
      },
      {
        key: "department",
        label: "Department",
        type: "select",
        required: true,
        options: departmentOptions,
      },
      {
        key: "designation",
        label: "Designation",
        placeholder: "Senior Engineer",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "jane@company.com",
      },
      {
        key: "phone",
        label: "Phone",
        type: "tel",
        placeholder: "+1 555 000 0000",
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["active", "blocked", "deleted"],
        defaultValue: "active",
      },
    ],
    [departmentOptions],
  );

  const pageError =
    error ||
    departmentsError ||
    (!departmentsLoading && departmentOptions.length === 0
      ? "No departments found. Add departments under Settings → Department first."
      : null);

  return (
    <DynamicDataPage
      title="Employees"
      subtitle="Manage corporate profiles, roles, and authorization vectors."
      data={employees}
      idKey="_id"
      columns={[
        { key: "employeeId", label: "ID / Code", type: "mono", sortable: true },
        { key: "name", label: "Full Name", sortable: true },
        { key: "department", label: "Department", sortable: true },
        { key: "designation", label: "Designation" },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "phone" },
        { key: "status", label: "Status", type: "status" },
      ]}
      isLoading={isLoading || departmentsLoading}
      error={pageError}
      onCreate={onCreate}
      onEdit={onUpdate}
      onDelete={onDelete}
      formFields={formFields}
    />
  );
};
