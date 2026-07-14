"use client";

import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";

import {
  getDashboardRoute,
} from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleReturn = () => {
    if (user) {
      router.replace(
        getDashboardRoute(user.role.name)
      );
      return;
    }

    router.replace("/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <FiShield className="text-3xl" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Access denied
        </h1>

        <p className="mt-3 text-slate-600">
          Your account does not have permission to
          access this page.
        </p>

        <button
          type="button"
          onClick={handleReturn}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <FiArrowLeft />
          Return to dashboard
        </button>
      </div>
    </main>
  );
}