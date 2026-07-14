import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

interface DashboardErrorProps {
  message: string;
  onRetry: () => void;
}

export default function DashboardError({
  message,
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <FiAlertCircle className="mx-auto text-4xl text-red-500" />

      <h2 className="mt-4 text-lg font-semibold text-red-900">
        Unable to load dashboard
      </h2>

      <p className="mt-2 text-sm text-red-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
      >
        <FiRefreshCw />
        Try again
      </button>
    </div>
  );
}