"use client";

import { useState } from "react";

import toast from "react-hot-toast";

import {
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";

import {
  deleteTaskComment,
  updateTaskComment,
} from "@/services/taskService";

import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";
import { getUserInitials } from "@/utils/userInitials";

import type { TaskComment } from "@/types/task";

interface CommentListProps {
  comments: TaskComment[];
  onChanged: () => void;
}

const formatDateTime = (
  value: string
): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export default function CommentList({
  comments,
  onChanged,
}: CommentListProps) {
  const { user } = useAuth();

  const [editingComment, setEditingComment] =
    useState<TaskComment | null>(null);

  const [editingContent, setEditingContent] =
    useState("");

  const [deleteTarget, setDeleteTarget] =
    useState<TaskComment | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const openEdit = (
    comment: TaskComment
  ) => {
    setEditingComment(comment);
    setEditingContent(comment.content);
  };

  const handleUpdate = async () => {
    if (
      !editingComment ||
      !editingContent.trim()
    ) {
      return;
    }

    try {
      setIsSaving(true);

      await updateTaskComment(
        editingComment.id,
        editingContent.trim()
      );

      toast.success("Comment updated.");

      setEditingComment(null);
      setEditingContent("");

      onChanged();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update comment."
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteTaskComment(
        deleteTarget.id
      );

      toast.success("Comment deleted.");

      setDeleteTarget(null);
      onChanged();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete comment."
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 px-6 py-10 text-center">
        <p className="text-sm text-slate-500">
          No comments have been added.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => {
          const isOwner =
            comment.userId === user?.id;

          const canDelete =
            isOwner ||
            user?.role.name === "ADMIN" ||
            user?.role.name ===
              "PROJECT_MANAGER";

          return (
            <article
              key={comment.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {getUserInitials(
                    comment.user.name
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {comment.user.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatDateTime(
                          comment.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() =>
                            openEdit(comment)
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiEdit2 />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget(
                              comment
                            )
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(editingComment)}
        title="Edit comment"
        onClose={() =>
          setEditingComment(null)
        }
        maxWidth="max-w-lg"
      >
        <textarea
          rows={5}
          value={editingContent}
          onChange={(event) =>
            setEditingContent(
              event.target.value
            )
          }
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              setEditingComment(null)
            }
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={
              isSaving ||
              !editingContent.trim()
            }
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : "Save comment"}
          </button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete comment"
        isSubmitting={isDeleting}
        onClose={() =>
          setDeleteTarget(null)
        }
        onConfirm={handleDelete}
      />
    </>
  );
}