import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          "px-6 py-2 rounded-md border border-white text-white disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-70",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
