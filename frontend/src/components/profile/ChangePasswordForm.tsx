"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";

import { changePassword } from "@/services/profileService";
import { getApiErrorMessage } from "@/utils/apiError";

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    values: PasswordFormValues
  ) => {
    try {
      await changePassword({
        currentPassword:
          values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword:
          values.confirmPassword,
      });

      toast.success(
        "Password changed successfully."
      );

      reset();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to change password."
        )
      );
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Change password
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use a strong password that you do not
          reuse on other services.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Current password
          </label>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={
                showCurrentPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              className={[
                "w-full rounded-xl border bg-white py-3 pl-11 pr-12 outline-none",
                errors.currentPassword
                  ? "border-red-400"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              ].join(" ")}
              {...register("currentPassword", {
                required:
                  "Current password is required.",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowCurrentPassword(
                  (current) => !current
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showCurrentPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>

          {errors.currentPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            New password
          </label>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              className={[
                "w-full rounded-xl border bg-white py-3 pl-11 pr-12 outline-none",
                errors.newPassword
                  ? "border-red-400"
                  : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              ].join(" ")}
              {...register("newPassword", {
                required:
                  "New password is required.",

                minLength: {
                  value: 8,
                  message:
                    "New password must contain at least 8 characters.",
                },

                validate: (
                  value,
                  formValues
                ) =>
                  value !==
                    formValues.currentPassword ||
                  "New password must be different from the current password.",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(
                  (current) => !current
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showNewPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>

          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm new password
          </label>

          <input
            type="password"
            autoComplete="new-password"
            className={[
              "w-full rounded-xl border bg-white px-4 py-3 outline-none",
              errors.confirmPassword
                ? "border-red-400"
                : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            ].join(" ")}
            {...register("confirmPassword", {
              required:
                "Password confirmation is required.",

              validate: (
                value,
                formValues
              ) =>
                value ===
                  formValues.newPassword ||
                "Passwords do not match.",
            })}
          />

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting
              ? "Updating..."
              : "Change password"}
          </button>
        </div>
      </form>
    </section>
  );
}