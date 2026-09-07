"use client";

import * as React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GstReportViewerProps {
 reportType?: "GSTR-1" | "GSTR-3B" | "GSTR-2A";
}

function GstReportViewer({ reportType = "GSTR-3B" }: GstReportViewerProps) {
 const [content, setContent] = React.useState(`<h2>${reportType} Summary</h2><p>Generated on ${new Date().toLocaleDateString("en-IN")}</p><h3>Overview</h3><p>Total outward supplies: ₹4,50,000</p><p>Total tax payable: ₹81,000</p><h3>Details</h3><ul><li>B2B Invoices: 15</li><li>B2C Invoices: 42</li><li>Credit/Debit Notes: 2</li></ul>`);

 const modules = {
 toolbar: [
 [{ header: [1, 2, 3, false] }],
 ["bold", "italic", "underline", "strike"],
 [{ list: "ordered" }, { list: "bullet" }],
 ["link", "image"],
 ["clean"],
 ],
 };

 return (
 <Card className="p-6">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-semibold text-lg">GST Report</h3>
 <div className="flex gap-2">
 <Button variant="outline" size="sm" onClick={() => window.print()}>Print</Button>
 <Button size="sm" onClick={() => navigator.clipboard.writeText(content)}>Copy HTML</Button>
 </div>
 </div>
 <div className="border rounded-lg">
 <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="min-h-[400px]" />
 </div>
 </Card>
 );
}

export { GstReportViewer };
