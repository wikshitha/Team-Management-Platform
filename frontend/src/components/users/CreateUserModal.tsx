"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";

import FormField from "@/components/users/FormField";
import Modal from "@/components/ui/Modal";

import { createUser } from "@/services/userService";
import { getApiErrorMessage } from "@/utils/apiError";

import type { SystemRole } from "@/types/user";
import type { CreateUserFormValues } from "@/components/users/userFormTypes";

interface CreateUserModalProps {
  isOpen: boolean;
  roles: SystemRole[];
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateUserModal({
  isOpen,
  roles,
  onClose,
  onCreated,
}: CreateUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<CreateUserFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleId: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (
    values: CreateUserFormValues
  ) => {
    try {
      await createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        roleId: values.roleId,
        status: values.status,
      });

      toast.success("User created successfully.");

      reset();
      onClose();
      onCreated();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to create user."
        )
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create user"
      description="Add a new user and assign their system role."
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <FormField
          label="Full name"
          placeholder="Enter full name"
          autoComplete="name"
          icon={<FiUser />}
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required.",
            minLength: {
              value: 2,
              message:
                "Name must contain at least 2 characters.",
            },
            maxLength: {
              value: 100,
              message:
                "Name cannot exceed 100 characters.",
            },
          })}
        />

        <FormField
          label="Email address"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
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

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            icon={<FiLock />}
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message:
                  "Password must contain at least 8 characters.",
              },
            })}
          />

          <FormField
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            icon={<FiLock />}
            error={
              errors.confirmPassword?.message
            }
            {...register("confirmPassword", {
              required:
                "Password confirmation is required.",
              validate: (value, formValues) =>
                 value === formValues.password ||
                "Passwords do not match.",
            })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              className={[
                "w-full rounded-xl border bg-white px-4 py-3 outline-none transition",
                errors.roleId
                  ? "border-red-400 focus:ring-2 focus:ring-red-100"
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

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("status")}
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
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
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating..."
              : "Create user"}
          </button>
        </div>
      </form>
    </Modal>
  );
}