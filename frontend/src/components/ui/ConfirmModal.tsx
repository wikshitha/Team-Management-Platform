"use client";

import {
  FiAlertTriangle,
  FiTrash2,
} from "react-icons/fi";

import Modal from "@/components/ui/Modal";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isSubmitting?: boolean;
  tone?: "danger" | "warning";
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  isSubmitting = false,
  tone = "danger",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const isDanger = tone === "danger";

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="text-center">
        <div
          className={[
            "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
            isDanger
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600",
          ].join(" ")}
        >
          {isDanger ? (
            <FiTrash2 className="text-3xl" />
          ) : (
            <FiAlertTriangle className="text-3xl" />
          )}
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={[
              "rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60",
              isDanger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-600 hover:bg-amber-700",
            ].join(" ")}
          >
            {isSubmitting
              ? "Processing..."
              : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}