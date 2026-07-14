import RoleGuard from "@/components/auth/RoleGuard";
import ProjectManagementPage from "@/components/projects/ProjectManagementPage";

export default function AdminProjectsPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <ProjectManagementPage
        basePath="/admin/projects"
        canDelete
        headingRole="Administration"
      />
    </RoleGuard>
  );
}