"use client";

import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  hasPreviousPage,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const visiblePages: number[] = [];

  const startPage = Math.max(1, page - 2);

  const endPage = Math.min(
    totalPages,
    page + 2
  );

  for (
    let pageNumber = startPage;
    pageNumber <= endPage;
    pageNumber += 1
  ) {
    visiblePages.push(pageNumber);
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:px-6">
      <p className="text-sm text-slate-500">
        Page{" "}
        <span className="font-semibold text-slate-700">
          {page}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-700">
          {Math.max(totalPages, 1)}
        </span>
        {" · "}
        {totalItems} user
        {totalItems === 1 ? "" : "s"}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(pageNumber)
            }
            className={[
              "h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition",
              pageNumber === page
                ? "bg-blue-600 text-white"
                : "border border-slate-300 text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {pageNumber}
          </button>
        ))}

        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}