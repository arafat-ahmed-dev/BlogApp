import React, { forwardRef, useId } from "react";

const Select = forwardRef(({ options, label, className, ...props }) => {
  const id = useId();
  return (
    <div>
      {label && (
        <label
          className={`inline-blockblock text-sm font-bold mb-2 ${className}`}
          htmlFor={id}
        ></label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
      >
        {options?.map((option) => (
          <option 
          key={option} 
          value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}, ref);

export default Select;
