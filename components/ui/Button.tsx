import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:   "bg-[#1a3a52] text-white hover:bg-[#0f1f2e] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "bg-[#d41f3d] text-white hover:bg-[#b01830] disabled:opacity-50 disabled:cursor-not-allowed",
  outline:   "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#1a3a52] hover:text-[#1a3a52] disabled:opacity-50",
  ghost:     "text-gray-700 hover:bg-gray-100 hover:text-[#1a3a52] disabled:opacity-50",
};

export function Button({
  children, href, variant = "primary", className = "", type = "button", onClick, disabled,
}: ButtonProps) {
  const classes = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold transition-all duration-200 ${variants[variant]} ${className}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
