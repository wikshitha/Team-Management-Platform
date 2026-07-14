interface PriorityBadgeProps {
  value: string;
}

const priorityClasses: Record<string, string> = {
  LOW:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  MEDIUM:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  HIGH:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  URGENT:
    "bg-red-50 text-red-700 ring-red-600/20",
};

export default function PriorityBadge({
  value,
}: PriorityBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        priorityClasses[value] ||
          "bg-slate-100 text-slate-700",
      ].join(" ")}
    >
      {value.charAt(0) +
        value.slice(1).toLowerCase()}
    </span>
  );
}