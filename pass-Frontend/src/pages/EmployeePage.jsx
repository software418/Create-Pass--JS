import DynamicDataPage from "@/master/Dynamic";
import { useEmployees } from "@/features/employee/useEmployee";
export const EmployeePage = () => {
  const { employees, isLoading, error, onCreate, onUpdate, onDelete } =
    useEmployees(); // your hook
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
      isLoading={isLoading}
      error={error}
      onCreate={onCreate}
      onEdit={onUpdate}
      onDelete={onDelete}
      formFields={[
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
          required: true,
          placeholder: "Engineering",
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
      ]}
    />
  );
};
