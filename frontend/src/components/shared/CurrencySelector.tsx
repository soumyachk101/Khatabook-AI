"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";

function CurrencySelector() {
 const { language, setLanguage } = useUserStore();

 return (
 <div className="flex items-center gap-2">
 <Globe className="size-4 text-muted-foreground" />
 <div className="flex rounded-md border">
 <Button variant={language === "en" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("en")} className="rounded-none rounded-l-md">
 EN
 </Button>
 <Button variant={language === "hi" ? "default" : "ghost"} size="sm" onClick={() => setLanguage("hi")} className="rounded-none rounded-r-md">
 HI
 </Button>
 </div>
 </div>
 );
}

export { CurrencySelector };
