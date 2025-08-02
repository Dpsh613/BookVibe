// frontend/src/components/ui/Button.jsx
import React from "react";

const baseStyles =
  "w-full flex justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

const variantStyles = {
  primary: "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600",
  success:
    "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
