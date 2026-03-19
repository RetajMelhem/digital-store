"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
  message: string;
  formAction?: (formData: FormData) => void | Promise<void>;
};

export function AdminConfirmButton({ children, className, message, formAction }: Props) {
  return (
    <button
      type="submit"
      className={className}
      formAction={formAction}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
