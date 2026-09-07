import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
 user: import("@/lib/types").User | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 language: "en" | "hi";
 setUser: (user: import("@/lib/types").User | null) => void;
 setLanguage: (lang: "en" | "hi") => void;
 logout: () => void;
}

export const useUserStore = create<UserState>()(
 persist(
 (set) => ({
 user: null,
 isAuthenticated: false,
 isLoading: false,
 language: "en",
 setUser: (user) => set({ user, isAuthenticated: !!user }),
 setLanguage: (language) => set({ language }),
 logout: () => set({ user: null, isAuthenticated: false }),
 }),
 { name: "user-storage" }
 )
);

interface UiState {
 sidebarOpen: boolean;
 isDarkMode: boolean;
 toggleSidebar: () => void;
 setSidebarOpen: (open: boolean) => void;
 toggleDarkMode: () => void;
}

export const useUiStore = create<UiState>()(
 persist(
 (set) => ({
 sidebarOpen: false,
 isDarkMode: false,
 toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
 setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
 toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
 }),
 { name: "ui-storage" }
 )
);

interface InvoiceState {
 currentInvoice: import("@/lib/types").Invoice | null;
 invoiceDraft: Partial<import("@/lib/types").Invoice> | null;
 setCurrentInvoice: (invoice: import("@/lib/types").Invoice | null) => void;
 setInvoiceDraft: (draft: Partial<import("@/lib/types").Invoice> | null) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
 currentInvoice: null,
 invoiceDraft: null,
 setCurrentInvoice: (currentInvoice) => set({ currentInvoice }),
 setInvoiceDraft: (invoiceDraft) => set({ invoiceDraft }),
}));

interface ReceiptState {
 currentReceipt: import("@/lib/types").Receipt | null;
 scanQueue: import("@/lib/types").Receipt[];
 addToScanQueue: (receipt: import("@/lib/types").Receipt) => void;
 clearQueue: () => void;
}

export const useReceiptStore = create<ReceiptState>((set) => ({
 currentReceipt: null,
 scanQueue: [],
 addToScanQueue: (receipt) => set((s) => ({ scanQueue: [...s.scanQueue, receipt] })),
 clearQueue: () => set({ scanQueue: [] }),
}));

interface GstState {
 selectedQuarter: string;
 selectedFinancialYear: string;
 setSelectedQuarter: (quarter: string) => void;
 setSelectedFinancialYear: (year: string) => void;
}

export const useGstStore = create<GstState>((set) => ({
 selectedQuarter: "Q3",
 selectedFinancialYear: "2024-25",
 setSelectedQuarter: (selectedQuarter) => set({ selectedQuarter }),
 setSelectedFinancialYear: (selectedFinancialYear) => set({ selectedFinancialYear }),
}));
