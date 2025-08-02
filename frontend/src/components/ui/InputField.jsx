// frontend/src/components/ui/InputField.jsx
import React from "react";

const inputStyles =
  "block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50";
const labelStyles = "block text-sm font-medium leading-6 text-slate-900";

function InputField({ id, label, type = "text", ...props }) {
  return (
    <div>
      <label htmlFor={id} className={labelStyles}>
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          name={id}
          type={type}
          required
          className={inputStyles}
          {...props}
        />
      </div>
    </div>
  );
}

export default InputField;
