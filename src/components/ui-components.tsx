
import React from "react";
import { cn } from "@/lib/utils";

interface LabelProps extends React.HTMLAttributes<HTMLParagraphElement> {
  htmlFor?: string;
}

export const Label = ({ className, children, htmlFor, ...props }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const Slider = ({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = "m",
  onChange,
  className,
  ...props
}: SliderProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <Label>{label}</Label>
        <span className="text-sm font-medium text-gray-900">{value.toFixed(1)} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer input-slider",
          className
        )}
        {...props}
      />
    </div>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        "bg-white/90 backdrop-blur-md border border-gray-100 rounded-xl shadow-xl p-5 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

export const Button = ({
  className,
  children,
  variant = "primary",
  size = "md",
  active = false,
  ...props
}: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-md",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };
  
  const sizes = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  const activeStyle = active ? "ring-2 ring-blue-500 ring-offset-2" : "";
  
  return (
    <button
      className={cn(
        baseStyle,
        variants[variant],
        sizes[size],
        activeStyle,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
