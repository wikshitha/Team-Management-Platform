"use client";

import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import ProfileInformation from "@/components/profile/ProfileInformation";
import LoadingScreen from "@/components/ui/LoadingScreen";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        Unable to load your account information.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-2 text-slate-600">
          Review your account details and manage
          your password.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileInformation user={user} />

        <ChangePasswordForm />
      </div>
    </div>
  );
}