"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FiMail,
  FiUser,
} from "react-icons/fi";

import FormField from "@/components/users/FormField";
import Modal from "@/components/ui/Modal";

import { updateUser } from "@/services/userService";
import { getApiErrorMessage } from "@/utils/apiError";

import type { SystemUser } from "@/types/user";
import type { EditUserFormValues } from "@/components/users/userFormTypes";

interface EditUserModalProps {
  isOpen: boolean;
  user: SystemUser | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onUpdated,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<EditUserFormValues>();

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [isOpen, reset, user]);

  const onSubmit = async (
    values: EditUserFormValues
  ) => {
    if (!user) {
      return;
    }

    try {
      await updateUser(user.id, {
        name: values.name.trim(),
        email: values.email.trim(),
      });

      toast.success("User updated successfully.");

      onClose();
      onUpdated();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update user."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit user"
      description="Update the user’s name and email address."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          label="Full name"
          placeholder="Enter full name"
          icon={<FiUser />}
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required.",
            minLength: {
              value: 2,
              message:
                "Name must contain at least 2 characters.",
            },
          })}
        />

        <FormField
          label="Email address"
          type="email"
          placeholder="name@example.com"
          icon={<FiMail />}
          error={errors.email?.message}
          {...register("email", {
            required:
              "Email address is required.",
            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "Enter a valid email address.",
            },
          })}
        />

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
              : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}