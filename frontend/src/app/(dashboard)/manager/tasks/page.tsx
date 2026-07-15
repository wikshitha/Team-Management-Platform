import RoleGuard from "@/components/auth/RoleGuard";
import TaskManagementPage from "@/components/tasks/TaskManagementPage";

export default function ManagerTasksPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <TaskManagementPage
        mode="MANAGER"
        basePath="/manager/tasks"
      />
    </RoleGuard>
  );
}