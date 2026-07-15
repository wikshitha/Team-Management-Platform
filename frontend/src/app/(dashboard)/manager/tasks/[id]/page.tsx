import RoleGuard from "@/components/auth/RoleGuard";
import TaskDetailsView from "@/components/tasks/TaskDetailsView";

export default function ManagerTaskDetailsPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <TaskDetailsView
        backHref="/manager/tasks"
      />
    </RoleGuard>
  );
}