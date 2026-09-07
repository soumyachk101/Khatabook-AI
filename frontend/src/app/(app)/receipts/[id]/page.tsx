"use client";

import * as React from "react";
import { ReceiptDetail } from "@/components/receipts/ReceiptDetail";
import { useReceipts } from "@/hooks/use-receipts";

function ReceiptDetailPage({ params }: { params: { id: string } }) {
 const { data: receipts } = useReceipts();
 const receipt = receipts?.find((r) => r.id === params.id);

 if (!receipt) return <div className="p-8 text-center">Receipt not found</div>;

 return <ReceiptDetail receipt={receipt} />;
}

export default ReceiptDetailPage;
