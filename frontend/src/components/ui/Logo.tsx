import { FiCheckSquare } from "react-icons/fi";

interface LogoProps {
  collapsed?: boolean;
  dark?: boolean;
}

export default function Logo({
  collapsed = false,
  dark = false,
}: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
        <FiCheckSquare className="text-xl" />
      </div>

      {!collapsed && (
        <div>
          <p
            className={[
              "text-lg font-bold",
              dark
                ? "text-white"
                : "text-slate-900",
            ].join(" ")}
          >
            TeamFlow
          </p>

          <p
            className={[
              "text-xs",
              dark
                ? "text-slate-400"
                : "text-slate-500",
            ].join(" ")}
          >
            Project Management
          </p>
        </div>
      )}
    </div>
  );
}