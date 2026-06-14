"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
  required?: boolean;
}

export function FormField({
  label,
  error,
  hint,
  children,
  id,
  className = "",
  required,
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label 
            htmlFor={id} 
            className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        </div>
      )}
      
      <div className="relative">
        {children}
      </div>

      {(error || hint) && (
        <div className="flex items-start gap-1.5 px-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error ? (
            <>
              <AlertCircle className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
              <p className="text-[11px] font-medium text-destructive leading-tight">
                {error}
              </p>
            </>
          ) : hint ? (
            <p className="text-[10px] text-muted-foreground leading-tight italic">
              {hint}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
