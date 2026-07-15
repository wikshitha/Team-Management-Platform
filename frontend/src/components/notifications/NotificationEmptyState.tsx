import { FiBell } from "react-icons/fi";

interface NotificationEmptyStateProps {
  unreadOnly: boolean;
}

export default function NotificationEmptyState({
  unreadOnly,
}: NotificationEmptyStateProps) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FiBell className="text-3xl" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {unreadOnly
          ? "No unread notifications"
          : "No notifications"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {unreadOnly
          ? "You have reviewed all of your current notifications."
          : "Project assignments, task updates, and comments will appear here."}
      </p>
    </div>
  );
}