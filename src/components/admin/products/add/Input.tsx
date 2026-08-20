// import React from "react";

// export const Input = ({
//   placeholder,
//   icon: Icon,
//   type = "text",
// }: {
//   placeholder?: string;
//   icon?: React.ElementType;
//   type?: string;
// }) => (
//   <div className="relative w-full">
//     <input
//       type={type}
//       placeholder={placeholder}
//       className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2] text-gray-700"
//     />
//     {Icon && (
//       <Icon
//         size={18}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
//       />
//     )}
//   </div>
// );



import React, { forwardRef } from "react";

// Using forwardRef so React Hook Form can "see" the input
// Adding ...props so that value, onChange, etc., are passed to the HTML input
export const Input = forwardRef<
  HTMLInputElement,
  {
    placeholder?: string;
    icon?: React.ElementType;
    type?: string;
    [key: string]: any; // Allows all other standard input props
  }
>(({ placeholder, icon: Icon, type = "text", ...props }, ref) => (
  <div className="relative w-full">
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      {...props} // This allows the form to work
      className="w-full bg-[#F9F9F9] rounded-lg px-4 py-3 text-sm outline-none placeholder:text-[#A2A2A2] text-gray-700 border border-transparent focus:border-gray-200 transition-all"
    />
    {Icon && (
      <Icon
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
    )}
  </div>
));

Input.displayName = "Input";