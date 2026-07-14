import type {
  InputHTMLAttributes,
  ReactNode,
} from "react";

interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export default function FormField({
  label,
  error,
  icon,
  className = "",
  ...inputProps
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          {...inputProps}
          className={[
            "w-full rounded-xl border bg-white py-3 outline-none transition",
            icon ? "pl-11 pr-4" : "px-4",
            error
              ? "border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
            className,
          ].join(" ")}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}