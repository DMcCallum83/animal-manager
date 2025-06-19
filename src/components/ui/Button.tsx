interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  className = "",
  ...props
}) => {
  const baseClasses = "button";
  const variantClasses = {
    primary: "button--primary",
    secondary: "button--secondary",
    danger: "button--danger",
  };
  const sizeClasses = {
    small: "button--small",
    medium: "button--medium",
    large: "button--large",
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
