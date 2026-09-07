"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvoiceTemplateSelectorProps {
 selected?: string;
 onSelect?: (template: string) => void;
}

function InvoiceTemplateSelector({ selected, onSelect }: InvoiceTemplateSelectorProps) {
 const templates = [
 { id: "simple", name: "Simple", desc: "Clean and minimal design" },
 { id: "professional", name: "Professional", desc: "Formal business layout" },
 { id: "modern", name: "Modern", desc: "Contemporary with colors" },
 ];

 return (
 <div className="space-y-4">
 <h3 className="font-semibold">Choose Template</h3>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 {templates.map((template) => (
 <Card
 key={template.id}
 className={cn("p-4 cursor-pointer transition-all hover:shadow-md", selected === template.id && "ring-2 ring-primary")}
 onClick={() => onSelect?.(template.id)}
 >
 <div className="aspect-[3/4] bg-muted rounded mb-3 flex items-center justify-center">
 <div className="text-xs text-muted-foreground">{template.name}</div>
 </div>
 <p className="font-medium text-sm">{template.name}</p>
 <p className="text-xs text-muted-foreground">{template.desc}</p>
 </Card>
 ))}
 </div>
 </div>
 );
}

import { cn } from "@/lib/utils";

export { InvoiceTemplateSelector };
