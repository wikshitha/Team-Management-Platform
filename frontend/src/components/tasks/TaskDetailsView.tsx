"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiCalendar,
  FiEdit2,
  FiFolder,
  FiMessageSquare,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";

import PriorityBadge from "@/components/dashboard/PriorityBadge";
import TaskStatusBadge from "@/components/tasks/TaskStatusBadge";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import CommentForm from "@/components/tasks/CommentForm";
import CommentList from "@/components/tasks/CommentList";

import {
  deleteTask,
  getTaskById,
  getTaskComments,
  updateTaskStatus,
} from "@/services/taskService";

import { getApiErrorMessage } from "@/utils/apiError";
import { formatDate } from "@/utils/dateFormat";
import { useAuth } from "@/context/AuthContext";

import type {
  Task,
  TaskComment,
  TaskStatus,
} from "@/types/task";

interface TaskDetailsViewProps {
  backHref: string;
}

export default function TaskDetailsView({
  backHref,
}: TaskDetailsViewProps) {
  const params = useParams<{
    id: string;
  }>();

  const taskId = params.id;

  const { user } = useAuth();

  const [task, setTask] =
    useState<Task | null>(null);

  const [comments, setComments] = useState<
    TaskComment[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isDeleteOpen, setIsDeleteOpen] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isStatusUpdating, setIsStatusUpdating] =
    useState(false);

  const canManage =
    user?.role.name === "ADMIN" ||
    user?.role.name === "PROJECT_MANAGER";

  const loadTask = useCallback(async () => {
    const response = await getTaskById(taskId);
    setTask(response.data.task);
  }, [taskId]);

  const loadComments = useCallback(async () => {
    const response =
      await getTaskComments(taskId);

    setComments(response.data.comments);
  }, [taskId]);

  const refreshAll = useCallback(async () => {
    try {
      await Promise.all([
        loadTask(),
        loadComments(),
      ]);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to refresh task."
        )
      );
    }
  }, [loadComments, loadTask]);

  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      try {
        const [
          taskResponse,
          commentsResponse,
        ] = await Promise.all([
          getTaskById(taskId),
          getTaskComments(taskId),
        ]);

        if (!isCancelled) {
          setTask(taskResponse.data.task);

          setComments(
            commentsResponse.data.comments
          );

          setErrorMessage("");
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            getApiErrorMessage(
              error,
              "Unable to load task details."
            )
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      isCancelled = true;
    };
  }, [taskId]);

  const handleStatusChange = async (
    status: TaskStatus
  ) => {
    if (!task || task.status === status) {
      return;
    }

    try {
      setIsStatusUpdating(true);

      await updateTaskStatus(task.id, {
        status,
      });

      toast.success(
        "Task status updated successfully."
      );

      await loadTask();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update task status."
        )
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!task) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteTask(task.id);

      toast.success("Task deleted successfully.");

      window.location.href = backHref;
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete task."
        )
      );

      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-72 rounded bg-slate-200" />
        <div className="h-64 rounded-2xl bg-slate-200" />
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (errorMessage || !task) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center">
        <h1 className="text-xl font-semibold text-red-900">
          Unable to load task
        </h1>

        <p className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>

        <Link
          href={backHref}
          className="mt-6 inline-flex rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Return to tasks
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to tasks
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {task.title}
              </h1>

              <TaskStatusBadge
                status={task.status}
              />

              <PriorityBadge
                value={task.priority}
              />
            </div>

            <p className="mt-3 max-w-3xl whitespace-pre-wrap leading-7 text-slate-600">
              {task.description ||
                "No task description has been provided."}
            </p>
          </div>

          {canManage && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsEditOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                <FiEdit2 />
                Edit
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsDeleteOpen(true)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <FiFolder className="text-2xl text-blue-600" />

          <p className="mt-4 font-bold text-slate-900">
            {task.project.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Project
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <FiUser className="text-2xl text-violet-600" />

          <p className="mt-4 font-bold text-slate-900">
            {task.assignedTo?.name ||
              "Unassigned"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Assigned Team Member
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <FiCalendar className="text-2xl text-red-600" />

          <p className="mt-4 font-bold text-slate-900">
            {formatDate(task.dueDate)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Due date
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <FiMessageSquare className="text-2xl text-emerald-600" />

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {comments.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Comments
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Update status
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Move the task through its workflow.
        </p>

        <select
          value={task.status}
          disabled={isStatusUpdating}
          onChange={(event) =>
            void handleStatusChange(
              event.target.value as TaskStatus
            )
          }
          className="mt-5 w-full max-w-sm rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">
            In Progress
          </option>
          <option value="IN_REVIEW">
            In Review
          </option>
          <option value="COMPLETED">
            Completed
          </option>
        </select>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Comments
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Discuss progress and task-related updates.
        </p>

        <div className="mt-6">
          <CommentForm
            taskId={taskId}
            onCreated={loadComments}
          />
        </div>

        <div className="mt-6">
          <CommentList
            comments={comments}
            onChanged={loadComments}
          />
        </div>
      </section>

      {canManage && (
        <>
          <TaskFormModal
            isOpen={isEditOpen}
            task={task}
            onClose={() =>
              setIsEditOpen(false)
            }
            onSaved={refreshAll}
          />

          <ConfirmModal
            isOpen={isDeleteOpen}
            title="Delete task"
            message={`Are you sure you want to permanently delete "${task.title}"? All comments attached to it will also be removed.`}
            confirmLabel="Delete task"
            isSubmitting={isDeleting}
            onClose={() =>
              setIsDeleteOpen(false)
            }
            onConfirm={handleDelete}
          />
        </>
      )}
    </div>
  );
}