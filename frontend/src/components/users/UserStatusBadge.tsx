import type { UserStatus } from "@/types/auth";

interface UserStatusBadgeProps {
  status: UserStatus;
}

export default function UserStatusBadge({
  status,
}: UserStatusBadgeProps) {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        isActive
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : "bg-red-50 text-red-700 ring-red-600/20",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive
            ? "bg-emerald-500"
            : "bg-red-500",
        ].join(" ")}
      />

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}