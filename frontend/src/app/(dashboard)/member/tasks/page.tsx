import RoleGuard from "@/components/auth/RoleGuard";
import TaskManagementPage from "@/components/tasks/TaskManagementPage";

export default function MemberTasksPage() {
  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER"]}>
      <TaskManagementPage
        mode="MEMBER"
        basePath="/member/tasks"
      />
    </RoleGuard>
  );
}