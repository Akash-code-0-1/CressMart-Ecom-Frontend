import React from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  error?: boolean;
  isTextArea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  required,
  type = "text",
  error,
  isTextArea = false,
}) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-[#727272] font-semibold text-lg font-poppins">
      {label} {required && <span className="text-[#FF7050]">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        placeholder={placeholder}
        className="bg-[#F9F9F9] px-6 py-5 rounded-[12px] outline-none text-sm border border-transparent focus:border-[#FF7050] transition-all min-h-[100px] font-poppins"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className={`bg-[#F9F9F9] px-6 py-5 rounded-[12px] outline-none text-base text-normal border ${
          error ? "border-[#FF7050]" : "border-transparent"
        } focus:border-[#FF7050] transition-all font-poppins`}
      />
    )}
  </div>
);

export default InputField;
