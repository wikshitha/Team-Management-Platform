import RoleGuard from "@/components/auth/RoleGuard";
import TaskDetailsView from "@/components/tasks/TaskDetailsView";

export default function AdminTaskDetailsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <TaskDetailsView backHref="/admin/tasks" />
    </RoleGuard>
  );
}