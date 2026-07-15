import RoleGuard from "@/components/auth/RoleGuard";
import TaskManagementPage from "@/components/tasks/TaskManagementPage";

export default function AdminTasksPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <TaskManagementPage
        mode="ADMIN"
        basePath="/admin/tasks"
      />
    </RoleGuard>
  );
}