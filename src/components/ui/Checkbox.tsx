import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={cn(
            'h-6 w-6 rounded shadow-sm text-ftc-blue focus:ring-2 focus:ring-ftc-blue focus:ring-offset-2 cursor-pointer',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
