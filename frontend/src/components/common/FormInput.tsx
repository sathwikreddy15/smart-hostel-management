import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    touched?: boolean;
    helperText?: string;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    touched,
    helperText,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    errorClassName = '',
    helperClassName = '',
    id,
    ...props
}) => {
    const defaultContainerClasses = 'space-y-1';
    const defaultLabelClasses = 'block text-sm font-medium text-gray-700';
    const defaultInputClasses = `
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-primary focus:ring-primary sm:text-sm
        ${error && touched ? 'border-red-300' : ''}
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    `;
    const defaultErrorClasses = 'text-sm text-red-600';
    const defaultHelperClasses = 'text-sm text-gray-500';

    return (
        <div className={`${defaultContainerClasses} ${containerClassName}`}>
            <label
                htmlFor={id}
                className={`${defaultLabelClasses} ${labelClassName}`}
            >
                {label}
            </label>
            <input
                id={id}
                className={`${defaultInputClasses} ${inputClassName}`}
                aria-invalid={error && touched ? 'true' : 'false'}
                aria-describedby={`${id}-error ${id}-helper`}
                {...props}
            />
            {error && touched && (
                <p
                    className={`${defaultErrorClasses} ${errorClassName}`}
                    id={`${id}-error`}
                    role="alert"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    className={`${defaultHelperClasses} ${helperClassName}`}
                    id={`${id}-helper`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default FormInput;

// FormSelect.tsx
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    touched?: boolean;
    helperText?: string;
    options: Array<{ value: string; label: string }>;
    containerClassName?: string;
    labelClassName?: string;
    selectClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    error,
    touched,
    helperText,
    options,
    containerClassName = '',
    labelClassName = '',
    selectClassName = '',
    errorClassName = '',
    helperClassName = '',
    id,
    ...props
}) => {
    const defaultContainerClasses = 'space-y-1';
    const defaultLabelClasses = 'block text-sm font-medium text-gray-700';
    const defaultSelectClasses = `
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-primary focus:ring-primary sm:text-sm
        ${error && touched ? 'border-red-300' : ''}
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    `;
    const defaultErrorClasses = 'text-sm text-red-600';
    const defaultHelperClasses = 'text-sm text-gray-500';

    return (
        <div className={`${defaultContainerClasses} ${containerClassName}`}>
            <label
                htmlFor={id}
                className={`${defaultLabelClasses} ${labelClassName}`}
            >
                {label}
            </label>
            <select
                id={id}
                className={`${defaultSelectClasses} ${selectClassName}`}
                aria-invalid={error && touched ? 'true' : 'false'}
                aria-describedby={`${id}-error ${id}-helper`}
                {...props}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && touched && (
                <p
                    className={`${defaultErrorClasses} ${errorClassName}`}
                    id={`${id}-error`}
                    role="alert"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    className={`${defaultHelperClasses} ${helperClassName}`}
                    id={`${id}-helper`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
};

// FormTextArea.tsx
interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    touched?: boolean;
    helperText?: string;
    containerClassName?: string;
    labelClassName?: string;
    textareaClassName?: string;
    errorClassName?: string;
    helperClassName?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
    label,
    error,
    touched,
    helperText,
    containerClassName = '',
    labelClassName = '',
    textareaClassName = '',
    errorClassName = '',
    helperClassName = '',
    id,
    ...props
}) => {
    const defaultContainerClasses = 'space-y-1';
    const defaultLabelClasses = 'block text-sm font-medium text-gray-700';
    const defaultTextareaClasses = `
        block w-full rounded-md border-gray-300 shadow-sm
        focus:border-primary focus:ring-primary sm:text-sm
        ${error && touched ? 'border-red-300' : ''}
        ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    `;
    const defaultErrorClasses = 'text-sm text-red-600';
    const defaultHelperClasses = 'text-sm text-gray-500';

    return (
        <div className={`${defaultContainerClasses} ${containerClassName}`}>
            <label
                htmlFor={id}
                className={`${defaultLabelClasses} ${labelClassName}`}
            >
                {label}
            </label>
            <textarea
                id={id}
                className={`${defaultTextareaClasses} ${textareaClassName}`}
                aria-invalid={error && touched ? 'true' : 'false'}
                aria-describedby={`${id}-error ${id}-helper`}
                {...props}
            />
            {error && touched && (
                <p
                    className={`${defaultErrorClasses} ${errorClassName}`}
                    id={`${id}-error`}
                    role="alert"
                >
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p
                    className={`${defaultHelperClasses} ${helperClassName}`}
                    id={`${id}-helper`}
                >
                    {helperText}
                </p>
            )}
        </div>
    );
}; 