"use client";

import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";

import {
  createTask,
  updateTask,
} from "@/services/taskService";

import {
  getProjectMembers,
  getProjects,
} from "@/services/projectService";

import { getApiErrorMessage } from "@/utils/apiError";
import { toDateInputValue } from "@/utils/dateFormat";

import type {
  Project,
  ProjectMember,
} from "@/types/project";

import type { Task } from "@/types/task";
import type { TaskFormValues } from "@/components/tasks/taskFormTypes";

interface TaskFormModalProps {
  isOpen: boolean;
  task?: Task | null;
  fixedProjectId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function TaskFormModal({
  isOpen,
  task = null,
  fixedProjectId,
  onClose,
  onSaved,
}: TaskFormModalProps) {
  const isEditing = Boolean(task);

  const [projects, setProjects] = useState<Project[]>(
    []
  );

  const [members, setMembers] = useState<
    ProjectMember[]
  >([]);

  const [isMembersLoading, setIsMembersLoading] =
    useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      projectId: fixedProjectId || "",
      priority: "MEDIUM",
      dueDate: "",
      assignedToId: "",
    },
  });

  useEffect(() => {
    if (!isOpen || fixedProjectId) {
      return;
    }

    let isCancelled = false;

    const initializeProjects = async () => {
      try {
        const response = await getProjects({
          page: 1,
          limit: 100,
        });

        if (!isCancelled) {
          setProjects(response.data.projects);
        }
      } catch (error) {
        if (!isCancelled) {
          toast.error(
            getApiErrorMessage(
              error,
              "Unable to load projects."
            )
          );
        }
      } 
    };

    void initializeProjects();

    return () => {
      isCancelled = true;
    };
  }, [fixedProjectId, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      title: task?.title || "",
      description: task?.description || "",
      projectId:
        fixedProjectId ||
        task?.projectId ||
        "",
      priority: task?.priority || "MEDIUM",
      dueDate: toDateInputValue(task?.dueDate),
      assignedToId: task?.assignedToId || "",
    });
  }, [
    fixedProjectId,
    isOpen,
    reset,
    task,
  ]);

  useEffect(() => {
    const initialProjectId =
      fixedProjectId || task?.projectId;

    if (!isOpen || !initialProjectId) {
      return;
    }

    let isCancelled = false;

    const initializeMembers = async () => {
      try {
        const response =
          await getProjectMembers(initialProjectId);

        if (!isCancelled) {
          setMembers(response.data.members);
        }
      } catch (error) {
        if (!isCancelled) {
          setMembers([]);

          toast.error(
            getApiErrorMessage(
              error,
              "Unable to load project members."
            )
          );
        }
      } 
    };

    void initializeMembers();

    return () => {
      isCancelled = true;
    };
  }, [
    fixedProjectId,
    isOpen,
    task?.projectId,
  ]);

  const loadMembersForProject = async (
    projectId: string
  ) => {
    if (!projectId) {
      setMembers([]);
      setValue("assignedToId", "");
      return;
    }

    try {
      setIsMembersLoading(true);

      const response =
        await getProjectMembers(projectId);

      setMembers(response.data.members);
    } catch (error) {
      setMembers([]);

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to load project members."
        )
      );
    } finally {
      setIsMembersLoading(false);
    }
  };

  const handleProjectChange = async (
    projectId: string
  ) => {
    setValue("projectId", projectId);
    setValue("assignedToId", "");

    await loadMembersForProject(projectId);
  };

  const onSubmit = async (
    values: TaskFormValues
  ) => {
    try {
      const input = {
        title: values.title.trim(),
        description:
          values.description.trim() || null,
        priority: values.priority,
        dueDate: values.dueDate || null,
        projectId: values.projectId,
        assignedToId:
          values.assignedToId || null,
      };

      if (task) {
        await updateTask(task.id, {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedToId: input.assignedToId,
        });

        toast.success(
          "Task updated successfully."
        );
      } else {
        await createTask(input);

        toast.success(
          "Task created successfully."
        );
      }

      onClose();
      onSaved();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing
            ? "Unable to update task."
            : "Unable to create task."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={
        isEditing
          ? "Edit task"
          : "Create task"
      }
      description={
        isEditing
          ? "Update task details and assignment."
          : "Create a task and assign it to a project member."
      }
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Task title
          </label>

          <input
            type="text"
            placeholder="Enter task title"
            className={[
              "w-full rounded-xl border px-4 py-3 outline-none",
              errors.title
                ? "border-red-400"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            ].join(" ")}
            {...register("title", {
              required: "Task title is required.",
              minLength: {
                value: 3,
                message:
                  "Task title must contain at least 3 characters.",
              },
              maxLength: {
                value: 200,
                message:
                  "Task title cannot exceed 200 characters.",
              },
            })}
          />

          {errors.title && (
            <p className="mt-2 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Describe the task"
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("description")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Project
            </label>

            {fixedProjectId ? (
              <input
                type="hidden"
                value={fixedProjectId}
                {...register("projectId")}
              />
            ) : (
              <select
                disabled={isEditing}
                className={[
                  "w-full rounded-xl border bg-white px-4 py-3 outline-none disabled:bg-slate-100",
                  errors.projectId
                    ? "border-red-400"
                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                ].join(" ")}
                {...register("projectId", {
                  required:
                    "Project is required.",
                  onChange: (event) => {
                    void handleProjectChange(
                      event.target.value
                    );
                  },
                })}
              >
                <option value="">
                 Select project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            )}

            {errors.projectId && (
              <p className="mt-2 text-sm text-red-600">
                {errors.projectId.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assign to
            </label>

            <select
              disabled={isMembersLoading}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              {...register("assignedToId")}
            >
              <option value="">
                {isMembersLoading
                  ? "Loading members..."
                  : "Unassigned"}
              </option>

              {members.map((membership) => (
                <option
                  key={membership.user.id}
                  value={membership.user.id}
                >
                  {membership.user.name} —{" "}
                  {membership.user.email}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Only active members assigned to the
              selected project can receive the task.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Priority
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("priority")}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">
                Medium
              </option>
              <option value="HIGH">High</option>
              <option value="URGENT">
                Urgent
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Due date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("dueDate")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}