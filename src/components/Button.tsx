import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "info" | "success"
type Size = "sm" | "md" | "lg" | "xl"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant
    size?: Size
    loading?: boolean
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    children?: ReactNode
}

const variantClasses: Record<Variant, string> = {
    primary: "bg-[var(--foreground)] text-[var(--background)] hover:opacity-85",
    secondary: "bg-[var(--surface-secondary)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--border)]",
    outline: "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--surface-secondary)]",
    ghost: "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]",
    danger: "bg-[#E24B4A] text-white hover:bg-[#A32D2D]",
    info: "bg-[#378ADD] text-white hover:bg-[#185FA5]",
    success: "bg-[#639922] text-white hover:bg-[#3B6D11]",
}

const sizeClasses: Record<Size, string> = {
    sm: "h-[30px] px-3 text-[13px] rounded-md",
    md: "h-[36px] px-4 text-[14px] rounded-md",
    lg: "h-[44px] px-[22px] text-[15px] rounded-md",
    xl: "h-[52px] px-7 text-[16px] rounded-[10px]",
}

const Spinner = () => (
    <svg
        className="w-[14px] h-[14px] animate-spin opacity-70"
        viewBox="0 0 14 14" fill="none"
    >
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="28" strokeDashoffset="10"
        />
    </svg>
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className = "",
    ...props
}, ref) => {
    const isDisabled = disabled || loading

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={[
                "inline-flex items-center justify-center gap-2",
                "font-medium leading-none whitespace-nowrap",
                "transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--border]",
                "active:scale-[0.97]",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
                variantClasses[variant],
                sizeClasses[size],
                fullWidth ? "w-full" : "",
                className,
            ].join(" ")}
            {...props}
        >
            {loading ? <Spinner /> : leftIcon}
            {children}
            {!loading && rightIcon}
        </button>
    )
})

Button.displayName = "Button"
export default Button