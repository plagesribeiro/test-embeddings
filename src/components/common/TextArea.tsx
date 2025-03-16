import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export function TextArea({ label, id, className = '', ...props }: TextAreaProps) {
    return (
        <div>
            <label
                className="block text-sm font-medium mb-2 text-blue-200"
                htmlFor={id}
            >
                {label}
            </label>
            <textarea
                id={id}
                className={`w-full h-32 bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${className}`}
                {...props}
            />
        </div>
    );
} 