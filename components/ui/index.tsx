import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-black text-white hover:bg-gray-800 focus:ring-black",
    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-400",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5",
        "text-sm font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}

      {children}
    </button>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2.5",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "outline-none transition",
          "focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
          error ? "border-red-500" : "border-gray-300",
          className,
        ].join(" ")}
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-900"
        >
          {label}
        </label>
      )}

      <textarea
        {...props}
        id={textareaId}
        className={[
          "min-h-32 w-full resize-y rounded-lg border bg-white px-3 py-2.5",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "outline-none transition",
          "focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10",
          error ? "border-red-500" : "border-gray-300",
          className,
        ].join(" ")}
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-sm text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={[
        "rounded-xl border border-gray-200 bg-white",
        "shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-xs font-medium",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({
  size = "md",
  className = "",
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "inline-block animate-spin rounded-full",
        "border-current border-t-transparent",
        sizes[size],
        className,
      ].join(" ")}
    />
  );
}

interface AlertProps {
  children: ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
}

export function Alert({
  children,
  variant = "info",
  title,
  className = "",
}: AlertProps) {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    success: "border-green-200 bg-green-50 text-green-900",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
    error: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={[
        "rounded-lg border px-4 py-3 text-sm",
        variants[variant],
        className,
      ].join(" ")}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (!label) {
    return (
      <div
        aria-hidden="true"
        className={`h-px bg-gray-200 ${className}`}
      />
    );
  }

  return (
    <div
      className={[
        "flex items-center gap-3",
        className,
      ].join(" ")}
    >
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs text-gray-500">{label}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
