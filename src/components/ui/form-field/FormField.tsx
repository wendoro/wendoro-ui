import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';
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
  const childProps = children.props as Record<string, unknown>;
  const fieldId = useStableId(htmlFor, 'wdr-field');
  const resolvedId = (childProps.id as string | undefined) ?? fieldId;
  const hintId = hint ? `${resolvedId}-hint` : undefined;
  const errorId = error ? `${resolvedId}-error` : undefined;
  const existingDescribedBy =
    typeof childProps['aria-describedby'] === 'string' ? childProps['aria-describedby'] : undefined;
  const describedBy =
    [existingDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  const isIntrinsicElement = typeof children.type === 'string';
  const injectedProps: Record<string, unknown> = {
    id: resolvedId,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : childProps['aria-invalid'],
    'aria-required': required ? true : childProps['aria-required'],
    disabled: disabled || Boolean(childProps.disabled),
  };
  if (!isIntrinsicElement) {
    injectedProps.error = error ? true : childProps.error;
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <Label htmlFor={resolvedId} required={required} optional={optional} disabled={disabled}>
          {label}
        </Label>
      )}
      {React.cloneElement(children, injectedProps)}
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
