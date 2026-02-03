import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'btn-touch inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ftc-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ftc-blue text-white hover:bg-ftc-blue/90 shadow-lg',
        secondary: 'bg-ftc-gray-200 text-ftc-gray-800 hover:bg-ftc-gray-300 shadow-md',
        ghost: 'hover:bg-ftc-gray-100 hover:text-ftc-gray-900',
        link: 'text-ftc-blue underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-11 px-4 text-sm',
        md: 'h-12 px-6',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-12 text-xl min-w-[200px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
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
