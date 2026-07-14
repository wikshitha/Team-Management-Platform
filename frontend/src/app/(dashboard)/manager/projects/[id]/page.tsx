import RoleGuard from "@/components/auth/RoleGuard";
import ProjectDetailsView from "@/components/projects/ProjectDetailsView";

export default function ManagerProjectDetailsPage() {
  return (
    <RoleGuard
      allowedRoles={["PROJECT_MANAGER"]}
    >
      <ProjectDetailsView
        backHref="/manager/projects"
      />
    </RoleGuard>
  );
}