import { Link } from "react-router-dom";

const baseClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-white/5",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "text-foreground hover:bg-white/5 hover:text-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  hero: "bg-primary text-primary-foreground rounded-full px-6 py-3 text-base font-medium hover:bg-primary/90",
  heroSecondary:
    "liquid-glass text-foreground rounded-full px-6 py-3 text-base font-normal hover:bg-white/5",
};

const sizeClasses = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-4 py-2 text-sm",
  lg: "h-11 px-8",
  icon: "h-10 w-10",
};

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

export function buttonVariants({ variant = "default", size = "default", className = "" } = {}) {
  return cx(baseClass, variantClasses[variant] || variantClasses.default, sizeClasses[size] || sizeClasses.default, className);
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  to,
  href,
  type = "button",
  children,
  ...props
}) {
  const classes = buttonVariants({ variant, size, className });

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
