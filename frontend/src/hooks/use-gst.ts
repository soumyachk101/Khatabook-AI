"use client";

import { useQuery } from "@tanstack/react-query";
import type { GstReturn, Gstr1Table, ItcSummary } from "@/lib/types";

async function mockFetchGstReturns(): Promise<GstReturn[]> {
 await new Promise((r) => setTimeout(r, 500));
 return [
 { id: "g1", userId: "u1", returnType: "GSTR-1", financialYear: "2025-26", quarter: "Q2", dueDate: "2025-07-11", status: "filed", totalTurnover: 450000, totalTax: 81000, itcAvailable: 65000, itcClaimed: 62000 },
 { id: "g2", userId: "u1", returnType: "GSTR-3B", financialYear: "2025-26", quarter: "Q2", dueDate: "2025-07-20", status: "filed", totalTurnover: 440000, totalTax: 79000, itcAvailable: 64000, itcClaimed: 60000 },
 ];
}

async function mockFetchGstr1Table(): Promise<Gstr1Table[]> {
 await new Promise((r) => setTimeout(r, 400));
 return [
 {
 id: "t1",
 returnId: "g1",
 section: "B2B",
 invoices: [],
 totalTaxableValue: 280000,
 totalCgst: 25200,
 totalSgst: 25200,
 totalIgst: 0,
 },
 {
 id: "t2",
 returnId: "g1",
 section: "B2C",
 invoices: [],
 totalTaxableValue: 170000,
 totalCgst: 15300,
 totalSgst: 15300,
 totalIgst: 0,
 },
 ];
}

async function mockFetchItcSummary(): Promise<ItcSummary[]> {
 await new Promise((r) => setTimeout(r, 400));
 return [
 { id: "i1", returnId: "g2", itcType: "input", totalItc: 45000, itcAvailable: 45000, itcClaimed: 42000, itcIneligible: 3000, ineligibleReason: "Blocked ITC" },
 { id: "i2", returnId: "g2", itcType: "input_service", totalItc: 20000, itcAvailable: 20000, itcClaimed: 18000, itcIneligible: 2000 },
 ];
}

export function useGstReturns() {
 return useQuery({
 queryKey: ["gst-returns"],
 queryFn: mockFetchGstReturns,
 });
}

export function useGstr1Tables() {
 return useQuery({
 queryKey: ["gstr1-tables"],
 queryFn: mockFetchGstr1Table,
 });
}

export function useItcSummary() {
 return useQuery({
 queryKey: ["itc-summary"],
 queryFn: mockFetchItcSummary,
 });
}
