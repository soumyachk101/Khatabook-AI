"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.ComponentProps<"input"> {
 onSearch?: (query: string) => void;
}

function SearchInput({ className, onChange, onSearch, ...props }: SearchInputProps) {
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 onChange?.(e);
 onSearch?.(e.target.value);
 };

 return (
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
 <input
 type="text"
 data-slot="search-input"
 className={cn(
 "pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs",
 "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
 className
 )}
 onChange={handleChange}
 {...props}
 />
 </div>
 );
}

export { SearchInput };
