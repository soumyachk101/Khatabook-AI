# COMPONENT_STRUCTURE.md — React Component Tree & State Management
## Khatabook AI

---

## Table of Contents
1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Directory Structure](#project-directory-structure)
3. [State Management (Zustand)](#state-management-zustand)
4. [Component Tree](#component-tree)
5. [Reusable Components Catalog](#reusable-components-catalog)
6. [Route Structure](#route-structure)
7. [API Layer](#api-layer)
8. [Context Providers](#context-providers)

---

## Tech Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND STACK │
├─────────────────────────────────────────────────────────┤
│ Framework: React 18 + TypeScript │
│ Build: Vite 5 │
│ Styling: Tailwind CSS 3 + CSS Variables │
│ State: Zustand 4 + React Query (TanStack Query) │
│ Routing: React Router 6 │
│ Forms: React Hook Form + Zod validation │
│ OCR/AI: Tesseract.js (on-device) + OpenAI API (cloud)│
│ Charts: Recharts │
│ PDF: react-pdf / @react-pdf/renderer │
│ Icons: Lucide React │
│ Animations: Framer Motion │
│ Notifications: react-hot-toast │
│ Storage: IndexedDB (idb) + localStorage │
│ i18n: react-i18next │
│ PWA: vite-plugin-pwa │
│ Testing: Vitest + React Testing Library │
│ E2E: Playwright │
└─────────────────────────────────────────────────────────┘
```

---

## Project Directory Structure

```
src/
├── main.tsx # App entry point
├── App.tsx # Root component + Router
├── vite-env.d.ts # Vite type declarations
│
├── app/ # App-level configuration
│ ├── providers.tsx # All context providers wrapper
│ ├── routes.tsx # Route definitions
│ ├── layout.tsx # Root layout (header, sidebar, footer)
│ ├── theme.ts # Theme configuration (colors, fonts)
│ └── i18n/ # Internationalization
│ ├── index.ts
│ ├── en.json
│ ├── hi.json
│ ├── ta.json
│ └── te.json
│
├── store/ # Zustand state management
│ ├── index.ts # Store exports
│ ├── authStore.ts # Authentication state
│ ├── receiptStore.ts # Receipt scanning state
│ ├── invoiceStore.ts # Invoice state
│ ├── expenseStore.ts # Expense tracking state
│ ├── gstStore.ts # GST report state
│ ├── paymentStore.ts # Payment state
│ ├── uiStore.ts # UI state (sidebar, theme, modals)
│ ├── notificationStore.ts # Notification preferences
│ └── subscriptionStore.ts # Plan/usage state
│
├── features/ # Feature-based modules (primary organization)
│ │
│ ├── auth/
│ │ ├── components/
│ │ │ ├── LoginForm.tsx
│ │ │ ├── SignupForm.tsx
│ │ │ ├── OTPInput.tsx
│ │ │ ├── OAuthButtons.tsx
│ │ │ ├── LanguageSelector.tsx
│ │ │ └── OnboardingWizard.tsx
│ │ ├── hooks/
│ │ │ └── useAuth.ts
│ │ ├── api/
│ │ │ └── authApi.ts
│ │ ├── store/
│ │ │ └── useAuthStore.ts (re-exported from store/)
│ │ └── types/
│ │ └── auth.types.ts
│ │
│ ├── dashboard/
│ │ ├── components/
│ │ │ ├── Dashboard.tsx
│ │ │ ├── StatCard.tsx
│ │ │ ├── IncomeExpenseChart.tsx
│ │ │ ├── CategoryChart.tsx
│ │ │ ├── ActivityFeed.tsx
│ │ │ ├── QuickActions.tsx
│ │ │ ├── GreetingHeader.tsx
│ │ │ └── WelcomeBanner.tsx
│ │ ├── hooks/
│ │ │ └── useDashboard.ts
│ │ └── api/
│ │ └── dashboardApi.ts
│ │
│ ├── scanner/
│ │ ├── components/
│ │ │ ├── ReceiptScanner.tsx
│ │ │ ├── CameraView.tsx
│ │ │ ├── ImagePreview.tsx
│ │ │ ├── ProcessingOverlay.tsx
│ │ │ ├── ReceiptEditForm.tsx
│ │ │ ├── ReceiptDetail.tsx
│ │ │ ├── FlashToggle.tsx
│ │ │ ├── CameraSwitch.tsx
│ │ │ └── GalleryPicker.tsx
│ │ ├── hooks/
│ │ │ ├── useCamera.ts
│ │ │ ├── useOCR.ts
│ │ │ └── useImageCapture.ts
│ │ ├── services/
│ │ │ ├── ocrService.ts # Tesseract wrapper
│ │ │ ├── receiptParser.ts # Extract structured data
│ │ │ └── gstExtractor.ts # Extract GST amounts
│ │ └── types/
│ │ └── receipt.types.ts
│ │
│ ├── invoices/
│ │ ├── components/
│ │ │ ├── InvoiceList.tsx
│ │ │ ├── InvoiceCard.tsx
│ │ │ ├── InvoiceDetail.tsx
│ │ │ ├── InvoiceForm.tsx
│ │ │ ├── InvoiceBuilder.tsx # Step-by-step wizard
│ │ │ ├── ClientSelector.tsx
│ │ │ ├── LineItemsEditor.tsx
│ │ │ ├── InvoicePreview.tsx
│ │ │ ├── SendInvoiceModal.tsx
│ │ │ ├── InvoicePDF.tsx # PDF template
│ │ │ ├── StatusBadge.tsx
│ │ │ ├── PaymentQR.tsx
│ │ │ └── InvoiceFilterBar.tsx
│ │ ├── hooks/
│ │ │ ├── useInvoices.ts
│ │ │ └── useInvoicePDF.ts
│ │ ├── api/
│ │ │ └── invoiceApi.ts
│ │ └── types/
│ │ └── invoice.types.ts
│ │
│ ├── expenses/
│ │ ├── components/
│ │ │ ├── ExpenseDashboard.tsx
│ │ │ ├── ExpenseList.tsx
│ │ │ ├── ExpenseCard.tsx
│ │ │ ├── ExpenseForm.tsx
│ │ │ ├── ExpenseDetail.tsx
│ │ │ ├── CategoryChart.tsx
│ │ │ ├── BudgetProgress.tsx
│ │ │ ├── SMSParser.tsx
│ │ │ └── RecurringSetup.tsx
│ │ ├── hooks/
│ │ │ ├── useExpenses.ts
│ │ │ └── useSMSParser.ts
│ │ ├── services/
│ │ │ └── smsParser.ts
│ │ └── types/
│ │ └── expense.types.ts
│ │
│ ├── gst/
│ │ ├── components/
│ │ │ ├── GSTRDashboard.tsx
│ │ │ ├── ComplianceCalendar.tsx
│ │ │ ├── GSTR1Report.tsx
│ │ │ ├── GSTR3BReport.tsx
│ │ │ ├── ITCReport.tsx
│ │ │ ├── AnnualReports.tsx
│ │ │ ├── ReminderSettings.tsx
│ │ │ ├── GSTRTable.tsx
│ │ │ └── ExportButton.tsx
│ │ ├── hooks/
│ │ │ ├── useGSTReports.ts
│ │ │ └── useGSTCalculations.ts
│ │ ├── services/
│ │ │ ├── gstCalculator.ts # GSTR-1/3B logic
│ │ │ ├── itcMatcher.ts # ITC matching
│ │ │ └── complianceCalendar.ts
│ │ └── types/
│ │ └── gst.types.ts
│ │
│ ├── payments/
│ │ ├── components/
│ │ │ ├── PaymentDashboard.tsx
│ │ │ ├── PaymentHistory.tsx
│ │ │ ├── RecordPaymentModal.tsx
│ │ │ ├── UPIShare.tsx
│ │ │ ├── PaymentQRGenerator.tsx
│ │ │ ├── ReminderScheduler.tsx
│ │ │ ├── PaymentConfirmation.tsx
│ │ │ └── BankDetailsForm.tsx
│ │ ├── hooks/
│ │ │ └── usePayments.ts
│ │ ├── services/
│ │ │ ├── upiService.ts
│ │ │ └── paymentReconciler.ts
│ │ └── types/
│ │ └── payment.types.ts
│ │
│ └── settings/
│ ├── components/
│ │ ├── SettingsLayout.tsx
│ │ ├── ProfileSection.tsx
│ │ ├── BusinessSection.tsx
│ │ ├── InvoiceDefaultsSection.tsx
│ │ ├── NotificationSettings.tsx
│ │ ├── PreferencesSection.tsx
│ │ ├── DataPrivacySection.tsx
│ │ ├── SubscriptionSection.tsx
│ │ ├── BackupRestore.tsx
│ │ └── SupportSection.tsx
│ ├── hooks/
│ │ └── useSettings.ts
│ └── api/
│ └── settingsApi.ts
│
├── components/ # Shared/reusable components (global)
│ ├── layout/
│ │ ├── AppShell.tsx # Desktop sidebar + mobile bottom nav
│ │ ├── Sidebar.tsx # Desktop navigation sidebar
│ │ ├── BottomNav.tsx # Mobile bottom tab bar
│ │ ├── Header.tsx # Top header bar
│ │ ├── MobileHeader.tsx # Mobile-specific header
│ │ └── NavItem.tsx # Navigation item component
│ │
│ ├── ui/ # Primitive UI components
│ │ ├── Button.tsx
│ │ ├── IconButton.tsx
│ │ ├── FAB.tsx # Floating Action Button
│ │ ├── Card.tsx
│ │ ├── StatCard.tsx
│ │ ├── Badge.tsx
│ │ ├── Chip.tsx
│ │ ├── Avatar.tsx
│ │ ├── Input.tsx
│ │ ├── TextArea.tsx
│ │ ├── Select.tsx
│ │ ├── Checkbox.tsx
│ │ ├── RadioGroup.tsx
│ │ ├── Toggle.tsx
│ │ ├── DatePicker.tsx
│ │ ├── SearchBar.tsx
│ │ ├── Modal.tsx
│ │ ├── BottomSheet.tsx
│ │ ├── Toast.tsx
│ │ ├── Alert.tsx
│ │ ├── Skeleton.tsx
│ │ ├── Spinner.tsx
│ │ ├── ProgressBar.tsx
│ │ ├── EmptyState.tsx
│ │ ├── Divider.tsx
│ │ ├── Tabs.tsx
│ │ ├── Accordion.tsx
│ │ ├── Tooltip.tsx
│ │ └── index.ts # Barrel export
│ │
│ ├── charts/
│ │ ├── BarChart.tsx
│ │ ├── LineChart.tsx
│ │ ├── AreaChart.tsx
│ │ ├── DonutChart.tsx
│ │ ├── PieChart.tsx
│ │ └── ChartCard.tsx
│ │
│ ├── forms/
│ │ ├── FormWrapper.tsx # React Hook Form wrapper
│ │ ├── FormField.tsx
│ │ ├── FormError.tsx
│ │ ├── PhoneInput.tsx # Indian phone input (+91)
│ │ ├── OTPInput.tsx
│ │ ├── GSTINInput.tsx # With validation
│ │ ├── AmountInput.tsx # Indian formatting
│ │ ├── ImageUpload.tsx # Receipt upload
│ │ ├── SignaturePad.tsx
│ │ └── DateRangePicker.tsx
│ │
│ └── business/
│ ├── InvoicePreview.tsx
│ ├── ReceiptPreview.tsx
│ ├── PaymentQR.tsx
│ ├── WhatsAppShare.tsx
│ ├── PrintButton.tsx
│ ├── PDFDownload.tsx
│ └── ShareSheet.tsx
│
├── lib/ # Utilities & third-party wrappers
│ ├── utils/
│ │ ├── formatCurrency.ts # Indian format: ₹1,00,000
│ │ ├── formatDate.ts # DD/MM/YYYY
│ │ ├── formatNumber.ts # Indian numbering
│ │ ├── generateInvoiceNumber.ts
│ │ ├── gstValidator.ts # GSTIN format checker
│ │ ├── calculateGST.ts # CGST/SGST/IGST calc
│ │ ├── calculateITC.ts # Input tax credit
│ │ ├── debounce.ts
│ │ ├── cn.ts # classnames utility (clsx + tailwind-merge)
│ │ └── storage.ts # IndexedDB helpers
│ ├── hooks/
│ │ ├── useMediaQuery.ts # Responsive breakpoints
│ │ ├── useOnlineStatus.ts
│ │ ├── useDebounce.ts
│ │ ├── useLocalStorage.ts
│ │ ├── useIndexedDB.ts
│ │ ├── useCamera.ts
│ │ └── useOCR.ts
│ ├── api/
│ │ ├── client.ts # Axios/fetch client
│ │ ├── auth.ts
│ │ ├── invoices.ts
│ │ ├── receipts.ts
│ │ ├── expenses.ts
│ │ ├── gst.ts
│ │ ├── payments.ts
│ │ └── client.ts
│ ├── constants/
│ │ ├── categories.ts # Expense categories
│ │ ├── gstRates.ts # Indian GST rates (5%, 12%, 18%, 28%)
│ │ ├── states.ts # Indian states list
│ │ ├── countries.ts # India + others
│ │ ├── paymentMethods.ts
│ │ ├── invoiceStatuses.ts
│ │ └── index.ts
│ ├── validators/
│ │ ├── gstin.ts
│ │ ├── phone.ts
│ │ ├── email.ts
│ │ ├── pan.ts
│ │ └── invoice.ts
│ └── errors/
│ ├── AppError.ts
│ ├── APIError.ts
│ ├── OCRError.ts
│ └── ValidationError.ts
│
├── pages/ # Route-level page components
│ ├── LandingPage.tsx
│ ├── AuthPage.tsx
│ ├── OnboardingPage.tsx
│ ├── DashboardPage.tsx
│ ├── ScannerPage.tsx
│ ├── InvoiceListPage.tsx
│ ├── InvoiceCreatePage.tsx
│ ├── InvoiceDetailPage.tsx
│ ├── ExpenseListPage.tsx
│ ├── ExpenseDetailPage.tsx
│ ├── GSTReportsPage.tsx
│ ├── GSTR1Page.tsx
│ ├── GSTR3BPage.tsx
│ ├── ITCPage.tsx
│ ├── PaymentsPage.tsx
│ ├── SettingsPage.tsx
│ └── NotFoundPage.tsx
│
├── assets/ # Static assets
│ ├── images/
│ │ ├── logo.svg
│ │ ├── logo-dark.svg
│ │ ├── hero-illustration.svg
│ │ ├── onboarding-1.svg
│ │ ├── onboarding-2.svg
│ │ ├── onboarding-3.svg
│ │ ├── onboarding-4.svg
│ │ └── empty-states/
│ ├── fonts/ # Self-hosted fonts if needed
│ └── icons/ # Custom icon assets
│
├── styles/
│ ├── globals.css # Tailwind + global styles
│ ├── variables.css # CSS custom properties
│ ├── animations.css # Keyframe animations
│ └── print.css # Print styles for invoices
│
└── types/
 ├── global.d.ts
 └── modules.d.ts
```

---

## State Management (Zustand)

### Store Architecture

```
┌─────────────────────────────────────────────────────────┐
│ ZUSTAND STORES │
├─────────────────────────────────────────────────────────┤
│ │
│ authStore ──── User auth, profile, tokens │
│ ├── user: User │
│ ├── token: string │
│ ├── isAuthenticated: boolean │
│ ├── login() / logout() / updateProfile() │
│ └── persist: localStorage │
│ │
│ receiptStore ──── Scanner state & history │
│ ├── receipts: Receipt[] │
│ ├── currentScan: ReceiptScan │
│ ├── isProcessing: boolean │
│ ├── scanReceipt() / saveReceipt() / deleteReceipt() │
│ └── persist: IndexedDB │
│ │
│ invoiceStore ──── Invoice CRUD │
│ ├── invoices: Invoice[] │
│ ├── currentDraft: Invoice │
│ ├── clients: Client[] │
│ ├── filters: InvoiceFilters │
│ ├── createInvoice() / updateInvoice() / sendInvoice() │
│ ├── deleteInvoice() / markAsPaid() │
│ ├── setFilters() / getFilteredInvoices() │
│ └── persist: IndexedDB │
│ │
│ expenseStore ──── Expense tracking │
│ ├── expenses: Expense[] │
│ ├── categories: Category[] │
│ ├── budgets: Budget[] │
│ ├── filters: ExpenseFilters │
│ ├── addExpense() / updateExpense() / deleteExpense() │
│ ├── setBudget() / getCategoryTotal() │
│ └── persist: IndexedDB │
│ │
│ gstStore ──── GST calculations & reports │
│ ├── gstData: GSTData │
│ ├── filings: GSTFiling[] │
│ ├── itc: ITCData │
│ ├── reminders: GSTReminder[] │
│ ├── calculateGSTR1() / calculateGSTR3B() │
│ ├── matchITC() / setReminder() │
│ └── persist: IndexedDB │
│ │
│ paymentStore ──── Payment tracking │
│ ├── payments: Payment[] │
│ ├── paymentMethods: PaymentMethod[] │
│ ├── recordPayment() / reconcilePayment() │
│ ├── getPendingPayments() / getPaymentHistory() │
│ └── persist: IndexedDB │
│ │
│ uiStore ──── UI state (not persisted) │
│ ├── sidebarOpen: boolean │
│ ├── theme: 'light' | 'dark' | 'system' │
│ ├── activeModal: string | null │
│ ├── activeBottomSheet: string | null │
│ ├── isLoading: boolean │
│ ├── toastQueue: Toast[] │
│ ├── toggleSidebar() / setTheme() / openModal() │
│ ├── closeModal() / showToast() / dismissToast()│
│ └── persist: none (session only) │
│ │
│ notificationStore ──── Notification prefs │
│ ├── preferences: NotificationPrefs │
│ ├── scheduledReminders: Reminder[] │
│ ├── updatePreferences() / scheduleReminder() │
│ └── persist: localStorage │
│ │
│ subscriptionStore ──── Plan & usage │
│ ├── plan: Plan │
│ ├── usage: Usage │
│ ├── upgradePlan() / cancelSubscription() │
│ └── persist: localStorage │
│ │
└─────────────────────────────────────────────────────────┘
```

### Zustand Store Example (authStore.ts)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';

interface User {
 id: string;
 name: string;
 email: string;
 phone: string;
 businessName?: string;
 gstin?: string;
 userType: 'freelancer' | 'business' | 'both';
 language: 'en' | 'hi' | 'hinglish' | 'ta' | 'te';
}

interface AuthState {
 user: User | null;
 token: string | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
}

interface AuthActions {
 login: (phone: string, password: string) => Promise<void>;
 loginWithOTP: (phone: string, otp: string) => Promise<void>;
 loginWithGoogle: (idToken: string) => Promise<void>;
 logout: () => void;
 updateProfile: (data: Partial<User>) => Promise<void>;
 updateBusiness: (data: BusinessData) => Promise<void>;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
 persist(
 (set, get) => ({
 // Initial state
 user: null,
 token: null,
 isAuthenticated: false,
 isLoading: false,
 error: null,

 // Actions
 login: async (phone, password) => {
 set({ isLoading: true, error: null });
 try {
 const response = await authApi.login(phone, password);
 set({
 user: response.user,
 token: response.token,
 isAuthenticated: true,
 isLoading: false,
 });
 } catch (error) {
 set({ error: error.message, isLoading: false });
 throw error;
 }
 },

 loginWithOTP: async (phone, otp) => {
 set({ isLoading: true, error: null });
 try {
 const response = await authApi.verifyOTP(phone, otp);
 set({
 user: response.user,
 token: response.token,
 isAuthenticated: true,
 isLoading: false,
 });
 } catch (error) {
 set({ error: error.message, isLoading: false });
 throw error;
 }
 },

 loginWithGoogle: async (idToken) => {
 set({ isLoading: true, error: null });
 try {
 const response = await authApi.googleLogin(idToken);
 set({
 user: response.user,
 token: response.token,
 isAuthenticated: true,
 isLoading: false,
 });
 } catch (error) {
 set({ error: error.message, isLoading: false });
 throw error;
 }
 },

 logout: () => {
 set({
 user: null,
 token: null,
 isAuthenticated: false,
 error: null,
 });
 },

 updateProfile: async (data) => {
 set({ isLoading: true });
 try {
 const updated = await authApi.updateProfile(data);
 set({ user: updated, isLoading: false });
 } catch (error) {
 set({ error: error.message, isLoading: false });
 throw error;
 }
 },

 updateBusiness: async (data) => {
 const { user } = get();
 if (!user) return;
 await get().updateProfile({
 ...user,
 businessName: data.businessName,
 gstin: data.gstin,
 });
 },

 setLoading: (loading) => set({ isLoading: loading }),
 setError: (error) => set({ error }),
 clearError: () => set({ error: null }),
 }),
 {
 name: 'auth-storage',
 storage: createJSONStorage(() => localStorage),
 partialize: (state) => ({
 user: state.user,
 token: state.token,
 isAuthenticated: state.isAuthenticated,
 }),
 }
 )
);
```

### Zustand Store Example (receiptStore.ts)

```typescript
import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { openDB } from 'idb';
import { ocrService } from '@/features/scanner/services/ocrService';
import { parseReceipt } from '@/features/scanner/services/receiptParser';

interface ReceiptItem {
 id: string;
 name: string;
 quantity: number;
 unitPrice: number;
 gstRate: number;
}

interface Receipt {
 id: string;
 userId: string;
 imageUri: string; // base64 or blob URL
 thumbnailUri?: string;
 vendor: string;
 date: string;
 totalAmount: number;
 subtotal: number;
 cgst: number;
 sgst: number;
 igst: number;
 items: ReceiptItem[];
 category: string;
 paymentMode: string;
 notes?: string;
 createdAt: string;
 updatedAt: string;
}

interface ReceiptScan {
 id: string;
 imageUri: string;
 isProcessing: boolean;
 progress: number;
 step: string;
 extractedData: Partial<Receipt> | null;
 error: string | null;
}

interface ReceiptState {
 receipts: Receipt[];
 currentScan: ReceiptScan | null;
 isScanning: boolean;
}

interface ReceiptActions {
 startScan: (imageUri: string) => void;
 processScan: (imageUri: string) => Promise<void>;
 updateExtractedData: (data: Partial<Receipt>) => void;
 saveReceipt: (data: Partial<Receipt>) => Promise<Receipt>;
 deleteReceipt: (id: string) => Promise<void>;
 getReceiptById: (id: string) => Receipt | undefined;
 cancelScan: () => void;
}

export const useReceiptStore = create<ReceiptState & ReceiptActions>()(
 persist(
 (set, get) => ({
 receipts: [],
 currentScan: null,
 isScanning: false,

 startScan: (imageUri) => {
 set({
 currentScan: {
 id: crypto.randomUUID(),
 imageUri,
 isProcessing: true,
 progress: 0,
 step: 'Starting...',
 extractedData: null,
 error: null,
 },
 isScanning: true,
 });
 },

 processScan: async (imageUri) => {
 const { currentScan } = get();
 if (!currentScan) return;

 try {
 // Step 1: OCR
 set(state => ({
 currentScan: {
 ...state.currentScan!,
 progress: 20,
 step: 'Scanning image with OCR...',
 },
 }));

 const ocrText = await ocrService.extractText(imageUri);

 // Step 2: Parse
 set(state => ({
 currentScan: {
 ...state.currentScan!,
 progress: 60,
 step: 'Extracting data...',
 },
 }));

 const extracted = await parseReceipt(ocrText, imageUri);

 // Step 3: Categorize
 set(state => ({
 currentScan: {
 ...state.currentScan!,
 progress: 90,
 step: 'Categorizing...',
 },
 }));

 // Final
 set(state => ({
 currentScan: {
 ...state.currentScan!,
 progress: 100,
 step: 'Complete',
 isProcessing: false,
 extractedData: extracted,
 },
 }));
 } catch (error) {
 set(state => ({
 currentScan: {
 ...state.currentScan!,
 isProcessing: false,
 error: error.message,
 },
 }));
 }
 },

 updateExtractedData: (data) => {
 const { currentScan } = get();
 if (!currentScan) return;
 set({
 currentScan: {
 ...currentScan,
 extractedData: { ...currentScan.extractedData, ...data },
 },
 });
 },

 saveReceipt: async (data) => {
 const { currentScan, receipts } = get();
 const receipt: Receipt = {
 id: currentScan?.id || crypto.randomUUID(),
 userId: '', // filled by auth context
 imageUri: currentScan?.imageUri || '',
 ...data as any,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString(),
 };

 set({ receipts: [receipt, ...receipts], currentScan: null, isScanning: false });

 // Save to IndexedDB
 const db = await openDB('khatabook', 1);
 await db.put('receipts', receipt);

 return receipt;
 },

 deleteReceipt: async (id) => {
 set(state => ({
 receipts: state.receipts.filter(r => r.id !== id),
 }));
 const db = await openDB('khatabook', 1);
 await db.delete('receipts', id);
 },

 getReceiptById: (id) => get().receipts.find(r => r.id === id),

 cancelScan: () => {
 set({ currentScan: null, isScanning: false });
 },
 }),
 {
 name: 'receipt-storage',
 storage: {
 getItem: async () => {
 const db = await openDB('khatabook', 1);
 const receipts = await db.getAll('receipts');
 return JSON.stringify({ receipts });
 },
 setItem: async (value) => {
 const { receipts } = JSON.parse(value);
 const db = await openDB('khatabook', 1);
 for (const receipt of receipts) {
 await db.put('receipts', receipt);
 }
 },
 removeItem: () => {
 // Clear on logout
 return Promise.resolve();
 },
 },
 partialize: (state) => ({ receipts: state.receipts }),
 }
 )
);
```

---

## Component Tree

### Full Application Component Tree

```
<App> # App.tsx
 │
 ├── <I18nextProvider> # Language context
 │ │
 │ ├── <QueryClientProvider> # React Query (server state)
 │ │
 │ ├── <ThemeProvider> # Theme (light/dark/system)
 │ │ │
 │ ├── <AuthProvider> # Auth context
 │ │ │
 │ ├── <AppShell> # Layout wrapper
 │ │ │ │
 │ │ ├── <MobileHeader /> # Mobile top bar (conditional)
 │ │ │ │
 │ │ ├── <Sidebar /> # Desktop sidebar (conditional)
 │ │ │ │
 │ │ ├── <main> # Content area
 │ │ │ │
 │ │ │ ├── <Routes>
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/" element={<LandingPage />} />
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/auth" element={<AuthPage />} />
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/onboarding" element={<OnboardingPage />} />
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/dashboard" element={<DashboardPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <Dashboard>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <GreetingHeader />
 │ │ │ │ │ ├── <StatsRow />
 │ │ │ │ │ │ ├── <StatCard /> × 5
 │ │ │ │ │ │
 │ │ │ │ │ ├── <ChartsSection>
 │ │ │ │ │ │ ├── <IncomeExpenseChart />
 │ │ │ │ │ │ └── <CategoryChart />
 │ │ │ │ │ │
 │ │ │ │ │ ├── <ActivityFeed>
 │ │ │ │ │ │ └── <ActivityItem /> × N
 │ │ │ │ │ │
 │ │ │ │ │ └── <QuickActions>
 │ │ │ │ │ │ └── <ActionCard /> × 4
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/scanner" element={<ScannerPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <ReceiptScanner>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <CameraView>
 │ │ │ │ │ │ ├── <FlashToggle />
 │ │ │ │ │ │ └── <CameraSwitch />
 │ │ │ │ │ │
 │ │ │ │ │ ├── <ProcessingOverlay>
 │ │ │ │ │ │ └── <Spinner />
 │ │ │ │ │ │
 │ │ │ │ │ └── <ReceiptEditForm>
 │ │ │ │ │ │ ├── <ImagePreview />
 │ │ │ │ │ │ ├── <AmountInput />
 │ │ │ │ │ │ ├── <GSTINInput />
 │ │ │ │ │ │ └── [Save buttons]
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/invoices" element={<InvoiceListPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <InvoiceList>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <InvoiceFilterBar>
 │ │ │ │ │ │ └── <FilterChip /> × N
 │ │ │ │ │ │
 │ │ │ │ │ └── <InvoiceCard /> × N
 │ │ │ │ │ │
 │ │ │ │ │ ├── <Route path="/invoices/create" element={<InvoiceCreatePage />} />
 │ │ │ │ │ │
 │ │ │ │ │ │ └── <InvoiceBuilder>
 │ │ │ │ │ │ │
 │ │ │ │ │ │ ├── <StepIndicator /> (1-2-3)
 │ │ │ │ │ │ │
 │ │ │ │ │ │ ├── Step 1: <ClientStep>
 │ │ │ │ │ │ │ ├── <ClientSelector />
 │ │ │ │ │ │ │ └── <ClientForm />
 │ │ │ │ │ │ │
 │ │ │ │ │ │ ├── Step 2: <ItemsStep>
 │ │ │ │ │ │ │ ├── <LineItemsEditor>
 │ │ │ │ │ │ │ │ └── <LineItemRow /> × N
 │ │ │ │ │ │ │ ├── <ItemTotalSummary />
 │ │ │ │ │ │ │ └── <AddItemButton />
 │ │ │ │ │ │ │
 │ │ │ │ │ │ ├── Step 3: <TermsStep>
 │ │ │ │ │ │ │ ├── <InvoicePreview />
 │ │ │ │ │ │ │ ├── <TermsEditor />
 │ │ │ │ │ │ │ └── <SendInvoiceModal />
 │ │ │ │ │ │ │
 │ │ │ │ │ │ └── [Navigation: Back / Continue]
 │ │ │ │ │ │
 │ │ │ │ │ └── <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
 │ │ │ │ │ │
 │ │ │ │ │ └── <InvoiceDetail>
 │ │ │ │ │ │ ├── <InvoicePreview /> (read-only)
 │ │ │ │ │ │ ├── <StatusBadge />
 │ │ │ │ │ │ ├── <PaymentInfo />
 │ │ │ │ │ │ └── <ActionButtons>
 │ │ │ │ │ │ ├── <ShareButton />
 │ │ │ │ │ │ ├── <DownloadButton />
 │ │ │ │ │ │ └── <EditButton />
 │ │ │ │ │ │
 │ │ │ │ ├── <Route path="/expenses" element={<ExpenseListPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <ExpenseDashboard>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <MonthSelector />
 │ │ │ │ │ ├── <TotalExpenseCard />
 │ │ │ │ │ ├── <CategoryChart />
 │ │ │ │ │ ├── <BudgetProgress /> × N
 │ │ │ │ │ └── <ExpenseList>
 │ │ │ │ │ │ └── <ExpenseCard /> × N
 │ │ │ │ │ │
 │ │ │ │ │ └── <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/gst" element={<GSTReportsPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <GSTRDashboard>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <GSTSummaryCards />
 │ │ │ │ │ ├── <ComplianceCalendar />
 │ │ │ │ │ ├── <GSTR1Report />
 │ │ │ │ │ ├── <GSTR3BReport />
 │ │ │ │ │ ├── <ITCReport />
 │ │ │ │ │ └── <ExportButtons />
 │ │ │ │ │
 │ │ │ │ │ └── <Route path="/gst/gstr1" element={<GSTR1Page />} />
 │ │ │ │ │ └── <Route path="/gst/gstr3b" element={<GSTR3BPage />} />
 │ │ │ │ │ └── <Route path="/gst/itc" element={<ITCPage />} />
 │ │ │ │ │
 │ │ │ │ ├── <Route path="/payments" element={<PaymentsPage />} />
 │ │ │ │ │
 │ │ │ │ │ └── <PaymentDashboard>
 │ │ │ │ │ │
 │ │ │ │ │ ├── <PaymentSummaryCards />
 │ │ │ │ │ ├── <PaymentMethodTabs>
 │ │ │ │ │ │ ├── UPI: <UPIShare />
 │ │ │ │ │ │ ├── Bank: <BankDetailsCard />
 │ │ │ │ │ │ └── Cash: <CashEntryForm />
 │ │ │ │ │ ├── <PaymentHistoryList>
 │ │ │ │ │ └── <ReminderScheduler />
 │ │ │ │ │
 │ │ │ │ └── <Route path="/settings" element={<SettingsPage />} />
 │ │ │ │ │
 │ │ │ │ └── <SettingsLayout>
 │ │ │ │ │
 │ │ │ │ ├── <ProfileSection />
 │ │ │ │ ├── <BusinessSection />
 │ │ │ │ ├── <InvoiceDefaultsSection />
 │ │ │ │ ├── <NotificationSettings />
 │ │ │ │ ├── <PreferencesSection />
 │ │ │ │ ├── <DataPrivacySection />
 │ │ │ │ ├── <SubscriptionSection />
 │ │ │ │ └── <SupportSection />
 │ │ │ │
 │ │ │
 │ │ ├── <BottomNav /> # Mobile bottom nav (conditional)
 │ │ │
 │ │ └── <ToastContainer /> # Global toasts
 │ │
 └── </AuthProvider>
 └── </ThemeProvider>
 └── </QueryClientProvider>
 └── </I18nextProvider>
```

---

## Reusable Components Catalog

### Layout Components

| Component | Props | Usage |
|-----------|-------|-------|
| `AppShell` | `children`, `activeRoute` | Root layout wrapper |
| `Sidebar` | `isOpen`, `onClose`, `collapsed` | Desktop sidebar nav |
| `BottomNav` | `activeRoute`, `onNavigate` | Mobile bottom tab bar |
| `Header` | `title`, `actions`, `greeting` | Top header bar |
| `MobileHeader` | `title`, `onBack`, `actions` | Mobile header with back |
| `NavItem` | `icon`, `label`, `active`, `badge`, `onPress` | Single nav item |
| `PageContainer` | `children`, `maxWidth`, `padding` | Page content wrapper |
| `Section` | `title`, `subtitle`, `children`, `action` | Section wrapper |
| `ScreenLoader` | `message` | Full-screen loading state |

### UI Components (Primitives)

| Component | Props | Usage |
|-----------|-------|-------|
| `Button` | `variant`, `size`, `disabled`, `loading`, `icon`, `onPress` | All buttons |
| `IconButton` | `icon`, `size`, `onPress`, `tooltip` | Icon-only buttons |
| `FAB` | `icon`, `onPress`, `position` | Floating action button |
| `Card` | `variant`, `padding`, `onPress`, `hoverable` | All card containers |
| `StatCard` | `label`, `value`, `trend`, `color`, `icon` | Dashboard stat cards |
| `Badge` | `status`, `text`, `size` | Status badges (Paid/Pending/etc) |
| `Chip` | `label`, `selected`, `onPress`, `variant` | Filter/tag chips |
| `Avatar` | `src`, `name`, `size`, `onPress` | User avatars |
| `Input` | `label`, `error`, `placeholder`, `leftIcon`, `rightIcon` | Text inputs |
| `TextArea` | `label`, `error`, `rows`, `maxLength` | Multi-line inputs |
| `Select` | `label`, `options`, `error`, `placeholder` | Dropdown selects |
| `Checkbox` | `label`, `checked`, `onChange`, `error` | Checkboxes |
| `RadioGroup` | `label`, `options`, `value`, `onChange` | Radio groups |
| `Toggle` | `label`, `checked`, `onChange`, `disabled` | Toggle switches |
| `DatePicker` | `label`, `value`, `onChange`, `min`, `max` | Date picker |
| `SearchBar` | `placeholder`, `value`, `onChange`, `onClear` | Search input |
| `Modal` | `visible`, `onClose`, `title`, `children` | Modal dialogs |
| `BottomSheet` | `visible`, `onClose`, `snapPoints`, `children` | Bottom sheets |
| `Toast` | `type`, `message`, `duration`, `action` | Toast notifications |
| `Alert` | `type`, `title`, `message`, `actions` | Alert dialogs |
| `Skeleton` | `variant`, `width`, `height`, `count` | Loading placeholders |
| `Spinner` | `size`, `color`, `label` | Loading spinner |
| `ProgressBar` | `value`, `max`, `color`, `size` | Progress bars |
| `EmptyState` | `icon`, `title`, `message`, `action` | Empty page states |
| `Divider` | `orientation`, `spacing` | Visual dividers |
| `Tabs` | `tabs`, `activeTab`, `onChange` | Tab navigation |
| `Accordion` | `items`, `allowMultiple` | Expandable sections |
| `Tooltip` | `text`, `children`, `position` | Hover tooltips |
| `PullToRefresh` | `onRefresh`, `children` | Pull-to-refresh wrapper |
| `SafeAreaView` | `edges`, `children` | Safe area wrapper |
| `KeyboardAvoidingView` | `behavior`, `children` | Keyboard avoidance |

### Form Components

| Component | Props | Usage |
|-----------|-------|-------|
| `FormWrapper` | `onSubmit`, `defaultValues`, `validation` | RHF wrapper |
| `FormField` | `name`, `label`, `control`, `rules`, `component` | RHF field |
| `PhoneInput` | `value`, `onChange`, `label`, `error` | Indian phone input |
| `OTPInput` | `length`, `onComplete`, `autoFocus` | OTP input boxes |
| `GSTINInput` | `value`, `onChange`, `error` | GSTIN with validation |
| `AmountInput` | `value`, `onChange`, `currency`, `error` | Formatted amount input |
| `ImageUpload` | `onSelect`, `maxSize`, `accept` | Image upload |
| `SignaturePad` | `onSave`, `width`, `height` | Signature capture |
| `DateRangePicker` | `startDate`, `endDate`, `onChange` | Date range |
| `CurrencyInput` | `value`, `onChange`, `locale` | Currency with symbol |

### Chart Components

| Component | Props | Usage |
|-----------|-------|-------|
| `BarChart` | `data`, `xKey`, `yKey`, `color`, `height` | Bar charts |
| `LineChart` | `data`, `xKey`, `yKeys`, `colors` | Line charts |
| `AreaChart` | `data`, `xKey`, `yKeys`, `colors` | Area charts |
| `DonutChart` | `data`, `dataKey`, `nameKey`, `colors` | Donut/pie charts |
| `ChartCard` | `title`, `children`, `action` | Chart in a card |
| `MiniSparkline` | `data`, `color`, `width`, `height` | Tiny sparkline |

### Business Components

| Component | Props | Usage |
|-----------|-------|-------|
| `InvoicePreview` | `invoice`, `showActions` | Live invoice preview |
| `ReceiptPreview` | `receipt`, `showActions` | Receipt preview |
| `PaymentQR` | `upiId`, `amount`, `name`, `size` | UPI QR code |
| `WhatsAppShare` | `phone`, `message`, `media` | WA share intent |
| `PrintButton` | `content`, `title` | Print/PDF trigger |
| `PDFDownload` | `url`, `filename`, `onComplete` | Download PDF |
| `ShareSheet` | `items`, `title` | Native share sheet |
| `StatusBadge` | `status`, `size` | Invoice/receipt status |
| `ReminderBadge` | `type`, `date`, `onPress` | Reminder indicator |

---

## Route Structure

```
Route Map
──────────────────────────────────────────────────────────
URL Component Auth Required Description
──────────────────────────────────────────────────────────
/ LandingPage No Public landing page
/auth AuthPage No Login/signup page
/onboarding OnboardingPage Yes User setup wizard
/dashboard DashboardPage Yes Main dashboard
/scanner ScannerPage Yes Receipt scanning
/invoices InvoiceListPage Yes All invoices
/invoices/create InvoiceCreatePage Yes Create new invoice
/invoices/:id InvoiceDetailPage Yes View single invoice
/invoices/:id/edit InvoiceEditPage Yes Edit existing invoice
/expenses ExpenseListPage Yes All expenses
/expenses/:id ExpenseDetailPage Yes View single expense
/expenses/create ExpenseCreatePage Yes Add new expense
/gst GSTReportsPage Yes GST overview
/gst/gstr1 GSTR1Page Yes GSTR-1 report
/gst/gstr3b GSTR3BPage Yes GSTR-3B report
/gst/itc ITCPage Yes ITC report
/gst/annual AnnualReportsPage Yes Annual GSTR-9
/payments PaymentsPage Yes Payment tracking
/payments/:id PaymentDetailPage Yes Payment details
/settings SettingsPage Yes App settings
/settings/profile ProfileSettingsPage Yes Edit profile
/settings/business BusinessSettingsPage Yes Business info
/settings/invoice InvoiceDefaultsPage Yes Invoice defaults
/settings/notifications NotificationSettingsPage Yes Notifications
/settings/preferences PreferencesPage Yes App preferences
/settings/data DataPrivacyPage Yes Data & privacy
/settings/subscription SubscriptionPage Yes Plan & billing
──────────────────────────────────────────────────────────

Protected Route Wrapper:
<RequireAuth>
 {isAuthenticated ? <Outlet /> : <Navigate to="/auth" />}
</RequireAuth>
```

---

## API Layer

### API Client Structure

```typescript
// lib/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL,
 headers: {
 'Content-Type': 'application/json',
 },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use((config) => {
 const token = useAuthStore.getState().token;
 if (token) {
 config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});

// Response interceptor — handle errors
apiClient.interceptors.response.use(
 (response) => response,
 (error) => {
 if (error.response?.status === 401) {
 useAuthStore.getState().logout();
 }
 return Promise.reject(error);
 }
);
```

### API Endpoints

```
┌──────────────────────────────────────────────────────────┐
│ API ENDPOINTS │
├──────────────────────────────────────────────────────────┤
│ │
│ AUTH │
│ POST /auth/signup — Create account │
│ POST /auth/login — Login with password │
│ POST /auth/otp/send — Send OTP │
│ POST /auth/otp/verify — Verify OTP │
│ POST /auth/oauth/google — Google OAuth │
│ POST /auth/oauth/apple — Apple OAuth │
│ POST /auth/refresh — Refresh token │
│ POST /auth/logout — Logout │
│ │
│ USER │
│ GET /user/profile — Get profile │
│ PUT /user/profile — Update profile │
│ PUT /user/business — Update business │
│ PUT /user/preferences — Update preferences │
│ │
│ RECEIPTS │
│ POST /receipts — Upload receipt image │
│ GET /receipts — List receipts │
│ GET /receipts/:id — Get receipt detail │
│ PUT /receipts/:id — Update receipt │
│ DELETE /receipts/:id — Delete receipt │
│ POST /receipts/:id/convert — Convert to invoice │
│ │
│ INVOICES │
│ POST /invoices — Create invoice │
│ GET /invoices — List invoices │
│ GET /invoices/:id — Get invoice │
│ PUT /invoices/:id — Update invoice │
│ DELETE /invoices/:id — Delete invoice │
│ POST /invoices/:id/send — Send invoice │
│ POST /invoices/:id/mark-paid — Mark as paid │
│ GET /invoices/:id/pdf — Download PDF │
│ GET /invoices/number — Get next invoice number │
│ │
│ CLIENTS │
│ POST /clients — Create client │
│ GET /clients — List clients │
│ GET /clients/:id — Get client │
│ PUT /clients/:id — Update client │
│ DELETE /clients/:id — Delete client │
│ │
│ EXPENSES │
│ POST /expenses — Create expense │
│ GET /expenses — List expenses │
│ GET /expenses/:id — Get expense │
│ PUT /expenses/:id — Update expense │
│ DELETE /expenses/:id — Delete expense │
│ GET /expenses/categories — Get categories │
│ PUT /expenses/budgets — Set budget │
│ │
│ GST │
│ GET /gst/summary — GST summary │
│ GET /gst/gstr1 — GSTR-1 data │
│ PUT /gst/gstr1 — Update GSTR-1 │
│ GET /gst/gstr3b — GSTR-3B data │
│ PUT /gst/gstr3b — Update GSTR-3B │
│ GET /gst/itc — ITC data │
│ POST /gst/file — File GST return │
│ GET /gst/calendar — Compliance calendar │
│ │
│ PAYMENTS │
│ GET /payments — List payments │
│ POST /payments — Record payment │
│ POST /payments/reconcile — Auto-reconcile │
│ POST /payments/reminders — Send reminder │
│ │
│ REPORTS │
│ GET /reports/pnl — Profit & Loss │
│ GET /reports/cashflow — Cash flow │
│ GET /reports/client-wise — Client report │
│ GET /reports/export — Export data │
│ │
│ SUBSCRIPTION │
│ GET /subscription/plan — Current plan │
│ GET /subscription/usage — Usage stats │
│ POST /subscription/upgrade — Upgrade plan │
│ POST /subscription/cancel — Cancel │
│ │
│ UPLOAD │
│ POST /upload/image — Upload image │
│ POST /upload/document — Upload PDF │
│ │
└──────────────────────────────────────────────────────────┘
```

### React Query Hooks Pattern

```typescript
// features/invoices/hooks/useInvoices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '../api/invoiceApi';
import { useInvoiceStore } from '@/store/invoiceStore';

export function useInvoices(filters?: InvoiceFilters) {
 return useQuery({
 queryKey: ['invoices', filters],
 queryFn: () => invoiceApi.getAll(filters),
 staleTime: 30_000, // 30 seconds
 });
}

export function useInvoice(id: string) {
 return useQuery({
 queryKey: ['invoices', id],
 queryFn: () => invoiceApi.getById(id),
 enabled: !!id,
 });
}

export function useCreateInvoice() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: invoiceApi.create,
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['invoices'] });
 },
 });
}

export function useSendInvoice() {
 const queryClient = useQueryClient();
 return useMutation({
 mutationFn: ({ id, method }: { id: string; method: string }) =>
 invoiceApi.send(id, method),
 onSuccess: () => {
 queryClient.invalidateQueries({ queryKey: ['invoices'] });
 },
 });
}
```

---

## Context Providers

### Provider Hierarchy

```tsx
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/features/auth';
import i18n from './i18n';

const queryClient = new QueryClient({
 defaultOptions: {
 queries: {
 refetchOnWindowFocus: false,
 retry: 1,
 staleTime: 30_000,
 },
 },
});

export function Providers({ children }: { children: React.ReactNode }) {
 return (
 <QueryClientProvider client={queryClient}>
 <I18nextProvider i18n={i18n}>
 <ThemeProvider
 attribute="data-theme"
 defaultTheme="system"
 enableSystem
 disableTransitionOnChange={false}
 >
 <AuthProvider>
 {children}
 </AuthProvider>
 </ThemeProvider>
 </I18nextProvider>
 </QueryClientProvider>
 );
}
```

### Auth Context

```tsx
// features/auth/AuthProvider.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AuthContextValue {
 user: User | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 login: (phone: string, password: string) => Promise<void>;
 loginWithOTP: (phone: string, otp: string) => Promise<void>;
 loginWithGoogle: () => Promise<void>;
 logout: () => void;
 updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
 const user = useAuthStore((s) => s.user);
 const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
 const isLoading = useAuthStore((s) => s.isLoading);
 const login = useAuthStore((s) => s.login);
 const loginWithOTP = useAuthStore((s) => s.loginWithOTP);
 const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
 const logout = useAuthStore((s) => s.logout);
 const updateProfile = useAuthStore((s) => s.updateProfile);

 return (
 <AuthContext.Provider value={{
 user,
 isAuthenticated,
 isLoading,
 login,
 loginWithOTP,
 loginWithGoogle,
 logout,
 updateProfile,
 }}>
 {children}
 </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) throw new Error('useAuth must be used within AuthProvider');
 return context;
}
```

---

## Performance Optimization

### Code Splitting Strategy

```typescript
// App.tsx — Lazy load feature routes
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ScannerPage = lazy(() => import('@/pages/ScannerPage'));
const InvoiceListPage = lazy(() => import('@/pages/InvoiceListPage'));
const GSTReportsPage = lazy(() => import('@/pages/GSTReportsPage'));

<Suspense fallback={<ScreenLoader />}>
 <Routes>
 <Route path="/dashboard" element={<DashboardPage />} />
 <Route path="/scanner" element={<ScannerPage />} />
 ...
 </Routes>
</Suspense>
```

### Image Optimization

```typescript
// components/OptimizedImage.tsx
import { useState } from 'react';

export function OptimizedImage({ src, alt, ...props }) {
 const [loaded, setLoaded] = useState(false);

 return (
 <>
 {!loaded && <Skeleton variant="rect" width={props.width} height={props.height} />}
 <img
 src={src}
 alt={alt}
 loading="lazy"
 decoding="async"
 onLoad={() => setLoaded(true)}
 style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
 {...props}
 />
 </>
 );
}
```

### Memoization Strategy

```typescript
// Memoize: Expensive list renders, chart data, computed values
const ExpenseCard = memo(({ expense, onPress }) => {
 // ...
});

const filteredExpenses = useMemo(
 () => expenses.filter(e => e.category === selectedCategory),
 [expenses, selectedCategory]
);

const categoryTotals = useMemo(
 () => expenses.reduce<Record<string, number>>((acc, e) => {
 acc[e.category] = (acc[e.category] || 0) + e.amount;
 return acc;
 }, {}),
 [expenses]
);
```

---

## Testing Structure

```
__tests__/
├── unit/
│ ├── components/
│ │ ├── Button.test.tsx
│ │ ├── Input.test.tsx
│ │ ├── StatCard.test.tsx
│ │ └── GSTINInput.test.tsx
│ ├── utils/
│ │ ├── formatCurrency.test.ts
│ │ ├── calculateGST.test.ts
│ │ ├── gstValidator.test.ts
│ │ └── generateInvoiceNumber.test.ts
│ ├── stores/
│ │ ├── authStore.test.ts
│ │ ├── receiptStore.test.ts
│ │ └── invoiceStore.test.ts
│ └── services/
│ ├── ocrService.test.ts
│ ├── receiptParser.test.ts
│ └── gstCalculator.test.ts
│
├── integration/
│ ├── auth/
│ │ ├── login.test.tsx
│ │ └── onboarding.test.tsx
│ ├── scanner/
│ │ └── receiptScanning.test.tsx
│ ├── invoices/
│ │ └── invoiceCreation.test.tsx
│ └── gst/
│ └── gstCalculation.test.tsx
│
├── e2e/
│ ├── onboarding.spec.ts
│ ├── receiptScanning.spec.ts
│ ├── invoiceFlow.spec.ts
│ ├── expenseTracking.spec.ts
│ └── gstFiling.spec.ts
│
└── fixtures/
├── receipts/
├── invoices/
└── users/
```
