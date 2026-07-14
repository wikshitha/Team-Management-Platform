import {
  FiFolder,
  FiPlus,
} from "react-icons/fi";

interface ProjectEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export default function ProjectEmptyState({
  hasFilters,
  onCreate,
  onClearFilters,
}: ProjectEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <FiFolder className="text-3xl" />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-slate-900">
        {hasFilters
          ? "No matching projects"
          : "No projects found"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No projects match the selected search and filters."
          : "Create your first project to begin assigning Team Members and tasks."}
      </p>

      <button
        type="button"
        onClick={
          hasFilters
            ? onClearFilters
            : onCreate
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {hasFilters ? (
          "Clear filters"
        ) : (
          <>
            <FiPlus />
            Create project
          </>
        )}
      </button>
    </div>
  );
}