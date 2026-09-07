"use client";

import * as React from "react";
import { useForm, FormProvider, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

function Form({ children, ...props }: React.ComponentProps<"form">) {
 return <form {...props}>{children}</form>;
}

function FormField<T extends Record<string, unknown>>({
 name,
 control,
 render,
}: {
 name: keyof T;
 control: UseFormReturn<T>["control"];
 render: (props: { field: { onChange: (e: unknown) => void; value: unknown; name: string } }) => React.ReactNode;
}) {
 return (
 <FormProvider {...({ control } as never)}>
 {render({
 field: {
 onChange: () => {},
 value: "",
 name: String(name),
 } as { onChange: (e: unknown) => void; value: unknown; name: string },
 })}
 </FormProvider>
 );
}

const FormItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => (
 <div ref={ref} className={cn("space-y-1.5", className)} {...props} />
));
FormItem.displayName = "FormItem";

function FormLabel({ className, ...props }: React.ComponentProps<"label">) {
 return <label className={cn("text-sm font-medium", className)} {...props} />;
}

const FormControl = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ ...props }, ref) => <div ref={ref} {...props} />);
FormControl.displayName = "FormControl";

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
 return <p className={cn("text-xs text-destructive", className)} {...props}>{children}</p>;
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };
