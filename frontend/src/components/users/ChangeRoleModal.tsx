"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "@/components/ui/Modal";

import { updateUserRole } from "@/services/userService";
import { getApiErrorMessage } from "@/utils/apiError";

import type {
  SystemRole,
  SystemUser,
} from "@/types/user";

import type { RoleFormValues } from "@/components/users/userFormTypes";

interface ChangeRoleModalProps {
  isOpen: boolean;
  user: SystemUser | null;
  roles: SystemRole[];
  onClose: () => void;
  onUpdated: () => void;
}

export default function ChangeRoleModal({
  isOpen,
  user,
  roles,
  onClose,
  onUpdated,
}: ChangeRoleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RoleFormValues>();

  useEffect(() => {
    if (user && isOpen) {
      reset({
        roleId: user.roleId,
      });
    }
  }, [isOpen, reset, user]);

  const onSubmit = async (
    values: RoleFormValues
  ) => {
    if (!user) {
      return;
    }

    try {
      await updateUserRole(user.id, {
        roleId: values.roleId,
      });

      toast.success(
        "User role updated successfully."
      );

      onClose();
      onUpdated();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update user role."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Change user role"
      description={
        user
          ? `Update the role assigned to ${user.name}.`
          : undefined
      }
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            System role
          </label>

          <select
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 outline-none transition",
              errors.roleId
                ? "border-red-400"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            ].join(" ")}
            {...register("roleId", {
              required: "Role is required.",
            })}
          >
            <option value="">
              Select role
            </option>

            {roles.map((role) => (
              <option
                key={role.id}
                value={role.id}
              >
                {role.name
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (letter) =>
                    letter.toUpperCase()
                  )}
              </option>
            ))}
          </select>

          {errors.roleId && (
            <p className="mt-2 text-sm text-red-600">
              {errors.roleId.message}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          Changing a user’s role may be rejected when
          the user owns projects or has existing project
          assignments.
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !user
            }
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting
              ? "Updating..."
              : "Update role"}
          </button>
        </div>
      </form>
    </Modal>
  );
}