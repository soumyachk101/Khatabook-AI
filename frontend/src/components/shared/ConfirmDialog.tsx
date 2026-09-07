"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface ConfirmDialogProps {
 open: boolean;
 onOpenChange: (open: boolean) => void;
 title: string;
 description: string;
 confirmLabel?: string;
 cancelLabel?: string;
 variant?: "default" | "destructive";
 onConfirm: () => void;
}

function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "default", onConfirm }: ConfirmDialogProps) {
 return (
 <Dialog open={open} onOpenChange={onOpenChange}>
 <DialogContent showClose={false}>
 <DialogHeader>
 <DialogTitle className="flex items-center gap-2">
 {variant === "destructive" && <AlertTriangle className="size-5 text-destructive" />}
 {title}
 </DialogTitle>
 <DialogDescription>{description}</DialogDescription>
 </DialogHeader>
 <DialogFooter>
 <Button variant="outline" onClick={() => onOpenChange(false)}>{cancelLabel}</Button>
 <Button variant={variant === "destructive" ? "destructive" : "default"} onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmLabel}</Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 );
}

export { ConfirmDialog };
