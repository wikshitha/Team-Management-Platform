import {
  FiCheckSquare,
  FiPlus,
} from "react-icons/fi";

interface TaskEmptyStateProps {
  hasFilters: boolean;
  canCreate: boolean;
  onCreate?: () => void;
  onClearFilters: () => void;
}

export default function TaskEmptyState({
  hasFilters,
  canCreate,
  onCreate,
  onClearFilters,
}: TaskEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <FiCheckSquare className="text-3xl" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-slate-900">
        {hasFilters
          ? "No matching tasks"
          : "No tasks found"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No tasks match your current search and filters."
          : canCreate
            ? "Create the first task and assign it to a project member."
            : "You currently have no tasks assigned to you."}
      </p>

      {hasFilters ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Clear filters
        </button>
      ) : canCreate ? (
        <button
          type="button"
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiPlus />
          Create task
        </button>
      ) : null}
    </div>
  );
}