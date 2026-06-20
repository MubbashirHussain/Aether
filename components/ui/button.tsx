import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "icon" | "default";
}

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-zinc-900 text-white hover:bg-zinc-800",
        variant === "ghost" && "bg-transparent text-zinc-600 hover:bg-zinc-100",
        size === "icon" && "h-9 w-9",
        size === "default" && "h-10 px-4 py-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}