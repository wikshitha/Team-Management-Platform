import type { Priority } from "@/types/project";

export interface TaskFormValues {
  title: string;
  description: string;
  projectId: string;
  priority: Priority;
  dueDate: string;
  assignedToId: string;
}