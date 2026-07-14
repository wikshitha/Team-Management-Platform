"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";

import {
  createProject,
  updateProject,
} from "@/services/projectService";

import { getApiErrorMessage } from "@/utils/apiError";
import { toDateInputValue } from "@/utils/dateFormat";

import type {Project} from "@/types/project";
import type { ProjectFormValues } from "@/components/projects/projectFormTypes";

interface ProjectFormModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectFormModal({
  isOpen,
  project = null,
  onClose,
  onSaved,
}: ProjectFormModalProps) {
  const isEditing = Boolean(project);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      name: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: "",
      dueDate: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (project) {
      reset({
        name: project.name,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        startDate: toDateInputValue(
          project.startDate
        ),
        dueDate: toDateInputValue(
          project.dueDate
        ),
      });

      return;
    }

    reset({
      name: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      startDate: "",
      dueDate: "",
    });
  }, [isOpen, project, reset]);

  const onSubmit = async (
    values: ProjectFormValues
  ) => {
    try {
      const input = {
        name: values.name.trim(),
        description:
          values.description.trim() || null,
        status: values.status,
        priority: values.priority,
        startDate: values.startDate || null,
        dueDate: values.dueDate || null,
      };

      if (project) {
        await updateProject(project.id, input);

        toast.success(
          "Project updated successfully."
        );
      } else {
        await createProject(input);

        toast.success(
          "Project created successfully."
        );
      }

      onClose();
      onSaved();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditing
            ? "Unable to update project."
            : "Unable to create project."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title={
        isEditing
          ? "Edit project"
          : "Create project"
      }
      description={
        isEditing
          ? "Update project information and scheduling."
          : "Create a project and configure its schedule."
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
            Project name
          </label>

          <input
            type="text"
            placeholder="Enter project name"
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 outline-none transition",
              errors.name
                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            ].join(" ")}
            {...register("name", {
              required:
                "Project name is required.",

              minLength: {
                value: 3,
                message:
                  "Project name must contain at least 3 characters.",
              },

              maxLength: {
                value: 150,
                message:
                  "Project name cannot exceed 150 characters.",
              },
            })}
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Describe the project"
            className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            {...register("description")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("status")}
            >
              <option value="PLANNING">
                Planning
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="ON_HOLD">
                On Hold
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>

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
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start date
            </label>

            <input
              type="date"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("startDate")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Due date
            </label>

            <input
              type="date"
              className={[
                "w-full rounded-xl border bg-white px-4 py-3 outline-none",
                errors.dueDate
                  ? "border-red-400"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              ].join(" ")}
              {...register("dueDate", {
                validate: (value) => {
                  const startDate =
                    getValues("startDate");

                  if (
                    !value ||
                    !startDate ||
                    value >= startDate
                  ) {
                    return true;
                  }

                  return "Due date must be on or after the start date.";
                },
              })}
            />

            {errors.dueDate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.dueDate.message}
              </p>
            )}
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
                : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}