import type {
  Priority,
  ProjectStatus,
} from "@/types/project";

export interface ProjectFormValues {
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: string;
  dueDate: string;
}