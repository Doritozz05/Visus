"use client";

import * as React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className = "", wrapperClassName = "", value, onChange, min, max, step = 1, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Combine forwarded ref and local ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const updateInputValue = (newValue: number) => {
      const input = inputRef.current;
      if (!input) return;

      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      if (setter) {
        setter.call(input, String(newValue));
        // Dispatch React-compatible events
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        input.value = String(newValue);
        if (onChange) {
          onChange({
            target: input,
            currentTarget: input,
          } as unknown as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    const increment = () => {
      const input = inputRef.current;
      if (!input) return;

      const currentValue = parseFloat(input.value) || 0;
      const stepValue = parseFloat(String(step)) || 1;
      const maxValue = max !== undefined ? parseFloat(String(max)) : Infinity;

      const newValue = Math.min(currentValue + stepValue, maxValue);
      updateInputValue(newValue);
    };

    const decrement = () => {
      const input = inputRef.current;
      if (!input) return;

      const currentValue = parseFloat(input.value) || 0;
      const stepValue = parseFloat(String(step)) || 1;
      const minValue = min !== undefined ? parseFloat(String(min)) : -Infinity;

      const newValue = Math.max(currentValue - stepValue, minValue);
      updateInputValue(newValue);
    };

    // Separate layout classes (for wrapper) from styling classes (for input)
    const classes = className.split(" ");
    const layoutPrefixes = ["w-", "min-w-", "max-w-", "flex-", "col-", "row-", "shrink-", "grow-", "basis-"];
    const layoutClasses = classes.filter(c => layoutPrefixes.some(p => c.startsWith(p) || c.includes(":" + p))).join(" ");
    const inputClasses = classes.filter(c => !layoutPrefixes.some(p => c.startsWith(p) || c.includes(":" + p))).join(" ");

    return (
      <div className={`relative group/number ${layoutClasses || "w-full"} ${wrapperClassName}`}>
        <input
          {...props}
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-8 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inputClasses}`}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-10">
          <button
            type="button"
            onClick={increment}
            tabIndex={-1}
            className="p-0.5 hover:bg-accent hover:text-primary rounded text-muted-foreground/70 transition-all active:scale-90"
            title="Increment"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={decrement}
            tabIndex={-1}
            className="p-0.5 hover:bg-accent hover:text-primary rounded text-muted-foreground/70 transition-all active:scale-90"
            title="Decrement"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
