import RoleGuard from "@/components/auth/RoleGuard";
import MemberProjectDetailsView from "@/components/projects/MemberProjectDetailsView";

export default function MemberProjectDetailsPage() {
  return (
    <RoleGuard allowedRoles={["TEAM_MEMBER"]}>
      <MemberProjectDetailsView />
    </RoleGuard>
  );
}