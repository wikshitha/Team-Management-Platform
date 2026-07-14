import {
  FiSearch,
  FiUserPlus,
} from "react-icons/fi";

interface UserEmptyStateProps {
  hasFilters: boolean;
  onCreateUser: () => void;
  onClearFilters: () => void;
}

export default function UserEmptyState({
  hasFilters,
  onCreateUser,
  onClearFilters,
}: UserEmptyStateProps) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <FiSearch className="text-3xl" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-slate-900">
        {hasFilters
          ? "No matching users"
          : "No users found"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "No users match your current search or filter selection."
          : "Create the first user to begin managing your team."}
      </p>

      <button
        type="button"
        onClick={
          hasFilters
            ? onClearFilters
            : onCreateUser
        }
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        {hasFilters ? (
          "Clear filters"
        ) : (
          <>
            <FiUserPlus />
            Create user
          </>
        )}
      </button>
    </div>
  );
}