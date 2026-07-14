import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: IconType;
  tone?: "blue" | "green" | "orange" | "red" | "purple";
}

const toneClasses = {
  blue: {
    container: "bg-blue-50",
    icon: "text-blue-600",
  },
  green: {
    container: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  orange: {
    container: "bg-amber-50",
    icon: "text-amber-600",
  },
  red: {
    container: "bg-red-50",
    icon: "text-red-600",
  },
  purple: {
    container: "bg-violet-50",
    icon: "text-violet-600",
  },
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "blue",
}: StatCardProps) {
  const selectedTone = toneClasses[tone];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            selectedTone.container,
          ].join(" ")}
        >
          <Icon
            className={[
              "text-2xl",
              selectedTone.icon,
            ].join(" ")}
          />
        </div>
      </div>
    </article>
  );
}