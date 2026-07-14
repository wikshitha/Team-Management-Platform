import RoleGuard from "@/components/auth/RoleGuard";
import ProjectManagementPage from "@/components/projects/ProjectManagementPage";

export default function ManagerProjectsPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <ProjectManagementPage
        basePath="/manager/projects"
        canDelete={false}
        headingRole="Project Manager"
      />
    </RoleGuard>
  );
}