interface StatusBadgeProps {
  value: string;
}

const statusClasses: Record<string, string> = {
  ACTIVE:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  PLANNING:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  TODO:
    "bg-slate-100 text-slate-700 ring-slate-600/20",

  IN_PROGRESS:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  IN_REVIEW:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  ON_HOLD:
    "bg-orange-50 text-orange-700 ring-orange-600/20",

  INACTIVE:
    "bg-red-50 text-red-700 ring-red-600/20",
};

export default function StatusBadge({
  value,
}: StatusBadgeProps) {
  const label = value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        statusClasses[value] ||
          "bg-slate-100 text-slate-700 ring-slate-600/20",
      ].join(" ")}
    >
      {label}
    </span>
  );
}