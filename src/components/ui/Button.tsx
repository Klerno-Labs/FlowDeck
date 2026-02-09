import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-normal disabled:pointer-events-none disabled:opacity-50 touch-manipulation active:scale-95',
  {
    variants: {
      variant: {
        // Primary: Blue background for main actions
        primary: 'bg-ftc-blue text-white hover:bg-ftc-blue/90 shadow-touch hover:shadow-touch-hover active:shadow-touch-active',

        // Secondary: White with blue border
        secondary: 'bg-white text-ftc-blue border-2 border-ftc-blue hover:bg-ftc-blue/5 shadow-touch hover:shadow-touch-hover',

        // Ghost: Transparent with hover
        ghost: 'text-ftc-blue hover:bg-ftc-blue/10 hover:text-ftc-blue/90',

        // Danger: Red for destructive actions
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-touch hover:shadow-touch-hover active:shadow-touch-active',

        // Success: Green for positive actions
        success: 'bg-ftc-green text-white hover:bg-ftc-green/90 shadow-touch hover:shadow-touch-hover active:shadow-touch-active',

        // Link: Underlined text link
        link: 'text-ftc-blue underline-offset-4 hover:underline',
      },
      size: {
        // sm: 40px height (touch-sm)
        sm: 'h-touch-sm px-4 text-sm',

        // md: 44px height (touch-md - WCAG AAA minimum)
        md: 'h-touch-md px-6 text-base',

        // lg: 48px height (touch-lg - primary actions)
        lg: 'h-touch-lg px-8 text-lg',

        // xl: 56px height (touch-xl - hero CTAs)
        xl: 'h-touch-xl px-12 text-xl min-w-[200px]',

        // icon: 48px square for navigation buttons
        icon: 'h-touch-lg w-touch-lg p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
