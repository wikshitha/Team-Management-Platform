"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { FiSend } from "react-icons/fi";

import { createTaskComment } from "@/services/taskService";
import { getApiErrorMessage } from "@/utils/apiError";

interface CommentFormValues {
  content: string;
}

interface CommentFormProps {
  taskId: string;
  onCreated: () => void;
}

export default function CommentForm({
  taskId,
  onCreated,
}: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (
    values: CommentFormValues
  ) => {
    try {
      await createTaskComment(
        taskId,
        values.content.trim()
      );

      toast.success("Comment added.");

      reset();
      onCreated();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to add comment."
        )
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <textarea
        rows={3}
        placeholder="Write a comment..."
        className={[
          "w-full resize-none rounded-xl border bg-white px-4 py-3 outline-none",
          errors.content
            ? "border-red-400"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
        ].join(" ")}
        {...register("content", {
          required:
            "Comment content is required.",
          maxLength: {
            value: 2000,
            message:
              "Comment cannot exceed 2000 characters.",
          },
        })}
      />

      {errors.content && (
        <p className="mt-2 text-sm text-red-600">
          {errors.content.message}
        </p>
      )}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <FiSend />

          {isSubmitting
            ? "Posting..."
            : "Post comment"}
        </button>
      </div>
    </form>
  );
}