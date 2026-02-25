import Image from "next/image";
import React, { ChangeEvent, CSSProperties, FC, useEffect, useState } from "react";

interface InputFieldProps {
    type?: "text" | "textarea" | "number" | "password" | "email" | "checkbox" | "state" | "date" | "select" | "search" | "url" | "tel";
    id?: string;
    name?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    maxLength?: number;
    minLength?: number;
    style?: CSSProperties;
    className?: string;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    label?: string;
    labelClassName?: string;
    disabled?: boolean;
    prefixIcon?: React.ReactNode;
    postfixIcon?: React.ReactNode;
    showWordCount?: boolean;
    endElement?: React.ReactNode;
    pattern?: boolean
}

const InputField: FC<InputFieldProps> = ({
    type = "text",
    id,
    name,
    value,
    onChange,
    maxLength = 500,
    minLength = 100,
    style = {},
    className = "w-full px-3 py-2 rounded-lg border-2 border-theme focus:outline-none text-sm placeholder:text-sm  dark:bg-[#13161d] ",
    rows = 6,
    placeholder = "",
    required = false,
    label,
    labelClassName = "text-base text-[#708090] font-normal",
    disabled = false,
    prefixIcon,
    postfixIcon,
    endElement,
    showWordCount = false,
    pattern = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange2 = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (type === "number" && (e.target.value.includes("e") || e.target.value.includes("E") || e.target.value.includes("+") || e.target.value.includes("-"))) {
            return; // You can choose to prevent the change here if needed
        } else {
            if (onChange) {
                onChange(e);
            }
        }
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const key = e.key;
        const currentValue = input.value;

        if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) {
            return;
        }
        // Allow: backspace, delete, tab, escape, enter, arrow keys, home/end
        if (['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(key)) {
            return;
        }

        if (key === '+' && currentValue.length === 0) {
            return;
        }

        if (!/^[0-9]$/.test(key)) {
            e.preventDefault();
            return;
        }
    };


    const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = e.clipboardData.getData('text');

        // Check if pasted text is valid (+ at start followed by only numbers)
        if (!/^[+]?[0-9]+$/.test(pastedText)) {
            e.preventDefault();
            return;
        }
    };


    return (
        <div className="mb-3 relative">
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    {label}
                    {required && <span className="text-red-500">&nbsp;*</span>}
                </label>
            )}

            {type === "textarea" ? (
                <div className="relative w-full">
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        className={`w-full p-2 mt-1 hover:border hover:border-primary-default ${className} `}
                        rows={rows}
                        minLength={minLength}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        style={{
                            textAlign: "left",
                            borderRadius: "8px",
                            paddingLeft: prefixIcon ? "40px" : "10px",
                            paddingRight: postfixIcon ? "40px" : "10px",
                            ...style,
                        }}
                        required={required}
                        disabled={disabled}
                    />

                    {showWordCount && (
                        <span className="absolute bottom-4 right-4 bg-common-white p-1 rounded-lg text-common-grey_dark font-normal text-sm">
                            at least {minLength} <span>characters</span>
                        </span>
                    )}
                </div>
            ) : (
                <div className="relative">
                    {prefixIcon && (
                        <div className="absolute inset-y-0 left-3 flex items-center">
                            {prefixIcon}
                        </div>
                    )}
                    <input
                        type={showPassword ? "text" : type}
                        id={id}
                        min={type === "number" ? "0" : undefined}
                        step={type === "number" ? "0.01" : undefined}
                        name={name}
                        value={value}
                        onChange={handleChange2}
                        onKeyDown={(name === "phoneNumber" || name === "phone" || name === "tel") ? handlePhoneKeyDown : undefined}
                        onPaste={(name === "phoneNumber" || name === "phone" || name === "tel") ? handlePhonePaste : undefined}
                        maxLength={maxLength}
                        className={`${className}`}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        {...(name === "email" && {
                            pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                            title: "Please enter a valid email address (e.g., example@domain.com).",
                        })}
                        {...(name === "linkedin_url" && {
                            pattern: "^https:\\/\\/(www\\.)?linkedin\\.com\\/.*$",
                            title: "Please enter a valid LinkedIn URL (e.g., https://www.linkedin.com/in/username/).",
                        })}
                        {...(pattern && type === "password" && {
                            pattern: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d\\W_]{8,}$",
                            title: "Password must be at least 8 characters long, include at least one letter, one number, and can contain special characters.",
                        })}
                        {...(name === "digital_product" && {
                            pattern: "^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$",
                            title: "Please enter a valid URL address (e.g., http://example.com).",
                        })}
                        {...((name === "phone" || name === "phoneNumber" || name === "tel") && {
                            pattern: "^[+]?[0-9]{10,15}$",
                            title: "Please enter a valid phone number (10-15 digits, optionally starting with +)",
                        })}
                        style={{
                            textAlign: "left",
                            borderRadius: "8px",
                            paddingLeft: prefixIcon ? "40px" : "10px",
                            paddingRight: postfixIcon ? "40px" : "10px",
                            ...style,
                        }}
                    />

                    {type === "password" && (
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={handleTogglePassword}
                        >
                            <Image
                                src={showPassword ? "/svgs/eye.svg" : "/svgs/eye-hide.svg"}
                                alt={showPassword ? "Hide Password" : "Show Password"}
                                width={24}
                                height={24}
                                className="h-6 w-6"
                            />
                        </div>
                    )}

                    {postfixIcon && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            {postfixIcon}
                        </div>
                    )}
                    {endElement && (
                        <div className="absolute inset-y-0 right-0 flex items-center">
                            {endElement}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InputField;
