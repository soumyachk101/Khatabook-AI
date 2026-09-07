"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorBoundaryState {
 hasError: boolean;
 error: Error | null;
}

interface ErrorBoundaryProps extends React.ComponentProps<"div"> {
 fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
 constructor(props: ErrorBoundaryProps) {
 super(props);
 this.state = { hasError: false, error: null };
 }

 static getDerivedStateFromError(error: Error): ErrorBoundaryState {
 return { hasError: true, error };
 }

 componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
 console.error("ErrorBoundary caught an error:", error, errorInfo);
 }

 render() {
 if (this.state.hasError) {
 if (this.props.fallback) return this.props.fallback;
 return (
 <div className={cn("flex flex-col items-center justify-center p-8 text-center", this.props.className)}>
 <AlertCircle className="size-12 text-destructive mb-4" />
 <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
 <p className="text-sm text-muted-foreground mb-4">{this.state.error?.message || "An unexpected error occurred"}</p>
 <button
 onClick={() => this.setState({ hasError: false, error: null })}
 className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
 >
 Try again
 </button>
 </div>
 );
 }
 return this.props.children;
 }
}

export { ErrorBoundary };
