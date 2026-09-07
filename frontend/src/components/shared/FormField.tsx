"use client";

import * as React from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
 name: string;
 label: string;
 type?: "text" | "email" | "number" | "date" | "textarea" | "select";
 options?: { value: string; label: string }[];
 placeholder?: string;
 required?: boolean;
 className?: string;
}

function FormField({ name, label, type = "text", options, placeholder, required, className }: FormFieldProps) {
 const { register, formState: { errors } } = useFormContext();
 const error = errors[name];

 return (
 <div className={cn("space-y-1.5", className)}>
 <label className="text-sm font-medium">
 {label}
 {required && <span className="text-destructive ml-1">*</span>}
 </label>
 {type === "textarea" ? (
 <textarea className={cn("flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm", error && "border-destructive")} placeholder={placeholder} {...register(name)} />
 ) : type === "select" && options ? (
 <select className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm", error && "border-destructive")} {...register(name)}>
 <option value="">Select...</option>
 {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
 </select>
 ) : (
 <input type={type} className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm", error && "border-destructive")} placeholder={placeholder} {...register(name)} />
 )}
 {error && <p className="text-xs text-destructive">{String(error.message)}</p>}
 </div>
 );
}

export { FormField };
