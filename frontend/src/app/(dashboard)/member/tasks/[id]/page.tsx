import RoleGuard from "@/components/auth/RoleGuard";
import TaskDetailsView from "@/components/tasks/TaskDetailsView";

export default function MemberTaskDetailsPage() {
  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER"]}>
      <TaskDetailsView backHref="/member/tasks" />
    </RoleGuard>
  );
}