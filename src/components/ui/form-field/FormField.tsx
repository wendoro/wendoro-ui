import * as React from 'react';
import { cn } from '@/utils/cn';
import { useStableId } from '@/hooks/use-id';
import { Label } from '../label';

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  children: React.ReactElement;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  optional = false,
  hint,
  error,
  disabled = false,
  className,
  children,
}: FormFieldProps) {
  const fieldId = useStableId(htmlFor, 'wdr-field');
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={fieldId} required={required} optional={optional} disabled={disabled}>
          {label}
        </Label>
      )}
      {React.cloneElement(children, {
        id: children.props.id ?? fieldId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : children.props['aria-invalid'],
        error: error ? true : children.props.error,
        disabled: disabled || children.props.disabled,
      })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
