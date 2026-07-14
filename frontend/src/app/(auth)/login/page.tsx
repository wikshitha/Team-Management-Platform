"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";

import Logo from "@/components/ui/Logo";
import {
  getDashboardRoute,
} from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";
import type { LoginCredentials } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    login,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      user
    ) {
      router.replace(
        getDashboardRoute(user.role.name)
      );
    }
  }, [
    isAuthenticated,
    isLoading,
    router,
    user,
  ]);

  const onSubmit = async (
    credentials: LoginCredentials
  ) => {
    try {
      const loggedInUser = await login(credentials);

      toast.success("Login successful.");

      const requestedPath =
        searchParams.get("next");

      const dashboardPath = getDashboardRoute(
        loggedInUser.role.name
      );

      if (
        requestedPath &&
        requestedPath.startsWith("/")
      ) {
        router.replace(requestedPath);
      } else {
        router.replace(dashboardPath);
      }
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to log in."
        )
      );
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Logo />

          <div className="mt-24 max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Project collaboration
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Manage projects, teams and tasks from one workspace.
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Plan projects, assign Team Members,
              manage task progress, and keep everyone
              informed.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            "Secure role-based access",
            "Project and task progress tracking",
            "Team assignment and notifications",
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-slate-300"
            >
              <FiCheckCircle className="text-xl text-blue-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to access your workspace.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    className={[
                      "w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none transition",
                      errors.email
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                    ].join(" ")}
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
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className={[
                      "w-full rounded-xl border bg-white py-3 pl-11 pr-12 outline-none transition",
                      errors.password
                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                    ].join(" ")}
                    {...register("password", {
                      required:
                        "Password is required.",
                      minLength: {
                        value: 8,
                        message:
                          "Password must contain at least 8 characters.",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </form>

            <div className="mt-8 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Development administrator
              </p>

              <p className="mt-2 text-sm text-slate-700">
                admin@example.com
              </p>

              <p className="text-sm text-slate-700">
                Admin@123
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}