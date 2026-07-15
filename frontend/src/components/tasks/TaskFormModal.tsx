"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

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

  const initialProjectId =
    fixedProjectId ||
    task?.projectId ||
    task?.project?.id ||
    "";

  const [projects, setProjects] = useState<
    Project[]
  >([]);

  const [members, setMembers] = useState<
    ProjectMember[]
  >([]);

  const [
    membersProjectId,
    setMembersProjectId,
  ] = useState("");

  const [
    isMembersChanging,
    setIsMembersChanging,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      projectId: initialProjectId,
      priority: "MEDIUM",
      dueDate: "",
      assignedToId: "",
    },
  });

  const selectedProjectId =
    useWatch({
      control,
      name: "projectId",
    }) || "";

  const activeMembers = members.filter(
    (membership) =>
      membership.user.status === "ACTIVE"
  );

  const isInitialMembersLoading =
    Boolean(
      isOpen &&
        selectedProjectId &&
        !isMembersChanging
    ) &&
    membersProjectId !== selectedProjectId;

  const isMembersLoading =
    isMembersChanging ||
    isInitialMembersLoading;

  /*
   * Load projects when the modal is opened from the
   * main task-management page.
   */
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
          setProjects(
            response.data.projects ?? []
          );
        }
      } catch (error) {
        if (!isCancelled) {
          setProjects([]);

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
  }, [
    fixedProjectId,
    isOpen,
  ]);

  /*
   * Reset the form whenever a task modal opens.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      title: task?.title || "",
      description: task?.description || "",
      projectId: initialProjectId,
      priority: task?.priority || "MEDIUM",
      dueDate: toDateInputValue(
        task?.dueDate
      ),
      assignedToId:
        task?.assignedToId || "",
    });
  }, [
    initialProjectId,
    isOpen,
    reset,
    task,
  ]);

  /*
   * Load members when editing a task or creating
   * a task from a fixed project-details page.
   */
  useEffect(() => {
    if (!isOpen || !initialProjectId) {
      return;
    }

    let isCancelled = false;

    const initializeMembers = async () => {
      try {
        const response =
          await getProjectMembers(
            initialProjectId
          );

        if (!isCancelled) {
          setMembers(
            response.data.members ?? []
          );

          setMembersProjectId(
            initialProjectId
          );
        }
      } catch (error) {
        if (!isCancelled) {
          setMembers([]);

          setMembersProjectId(
            initialProjectId
          );

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
    initialProjectId,
    isOpen,
  ]);

  /*
   * Load members after the user selects a project
   * while creating a new task.
   */
  const loadMembersForProject = async (
    projectId: string
  ) => {
    setValue("assignedToId", "");

    if (!projectId) {
      setMembers([]);
      setMembersProjectId("");
      return;
    }

    try {
      setIsMembersChanging(true);

      setMembers([]);
      setMembersProjectId("");

      const response =
        await getProjectMembers(projectId);

      setMembers(
        response.data.members ?? []
      );

      setMembersProjectId(projectId);
    } catch (error) {
      setMembers([]);
      setMembersProjectId(projectId);

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to load project members."
        )
      );
    } finally {
      setIsMembersChanging(false);
    }
  };

  const handleProjectChange = async (
    projectId: string
  ) => {
    setValue(
      "projectId",
      projectId,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    await loadMembersForProject(projectId);
  };

  const onSubmit = async (
    values: TaskFormValues
  ) => {
    try {
      const input = {
        title: values.title.trim(),

        description:
          values.description.trim() ||
          null,

        priority: values.priority,

        dueDate:
          values.dueDate || null,

        projectId: values.projectId,

        assignedToId:
          values.assignedToId || null,
      };

      if (task) {
        await updateTask(task.id, {
          title: input.title,
          description:
            input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedToId:
            input.assignedToId,
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
          <label
            htmlFor="task-title"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Task title
          </label>

          <input
            id="task-title"
            type="text"
            placeholder="Enter task title"
            className={[
              "w-full rounded-xl border px-4 py-3 outline-none transition",
              errors.title
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            ].join(" ")}
            {...register("title", {
              required:
                "Task title is required.",

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
          <label
            htmlFor="task-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="task-description"
            rows={5}
            placeholder="Describe the task"
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("description")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-project"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project
            </label>

            {fixedProjectId ? (
              <>
                <input
                  type="hidden"
                  {...register("projectId")}
                />

                <div className="rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-700">
                  {task?.project?.name ||
                    projects.find(
                      (project) =>
                        project.id ===
                        fixedProjectId
                    )?.name ||
                    "Current project"}
                </div>
              </>
            ) : (
              <select
                id="task-project"
                disabled={isEditing}
                className={[
                  "w-full rounded-xl border bg-white px-4 py-3 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100",
                  errors.projectId
                    ? "border-red-400 focus:ring-2 focus:ring-red-100"
                    : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                ].join(" ")}
                {...register("projectId", {
                  required:
                    "Project is required.",
                })}
                onChange={(event) => {
                  void handleProjectChange(
                    event.target.value
                  );
                }}
              >
                <option value="">
                  Select project
                </option>

                {task?.project &&
                  !projects.some(
                    (project) =>
                      project.id ===
                      task.project.id
                  ) && (
                    <option
                      value={task.project.id}
                    >
                      {task.project.name}
                    </option>
                  )}

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
            <label
              htmlFor="task-assignee"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Assign to
            </label>

            <select
              id="task-assignee"
              disabled={
                isMembersLoading ||
                !selectedProjectId
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              {...register("assignedToId")}
            >
              <option value="">
                {isMembersLoading
                  ? "Loading members..."
                  : !selectedProjectId
                    ? "Select a project first"
                    : activeMembers.length === 0
                      ? "No active project members available"
                      : "Unassigned"}
              </option>

              {activeMembers.map(
                (membership) => (
                  <option
                    key={
                      membership.user.id
                    }
                    value={
                      membership.user.id
                    }
                  >
                    {membership.user.name}
                    {" — "}
                    {membership.user.email}
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {isMembersLoading
                ? "Loading Team Members assigned to this project."
                : !selectedProjectId
                  ? "Select a project to view its Team Members."
                  : activeMembers.length === 0
                    ? "No active Team Members are assigned to this project."
                    : `${activeMembers.length} active Team ${
                        activeMembers.length === 1
                          ? "Member is"
                          : "Members are"
                      } available for assignment.`}
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-priority"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="task-priority"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("priority")}
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="URGENT">
                Urgent
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-due-date"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Due date
            </label>

            <input
              id="task-due-date"
              type="date"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("dueDate")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              isMembersLoading
            }
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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