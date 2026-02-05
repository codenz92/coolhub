import { useFormStatus } from 'react-dom';
import { ComponentProps } from 'react';

export function SubmitButton({
    children,
    className,
    ...props
}: ComponentProps<'button'>) {
    const { pending } = useFormStatus();

    return (
        <button
            {...props}
            type="submit"
            aria-disabled={pending}
            disabled={pending}
            className={`flex h-10 items-center justify-center rounded-md transition-all focus:outline-none ${className}`}
        >
            {pending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
                children
            )}
        </button>
    );
}