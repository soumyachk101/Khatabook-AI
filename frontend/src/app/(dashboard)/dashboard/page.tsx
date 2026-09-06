'use client'

import DashboardShell from '@/components/features/dashboard-shell'
import { StatsCard } from '@/components/features/stats-card'
import { RecentTransactions } from '@/components/features/recent-transactions'
import { useDashboard } from '@/hooks/use-dashboard'
import { TrendingUp, TrendingDown, Wallet, FileText, Receipt, AlertTriangle, IndianRupee } from 'lucide-react'
import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
 const { stats, categorySpend, monthlyData, invoiceCount, expenseCount, receiptCount } = useDashboard()
 const router = useRouter()

 const recentTransactions = [
	{ id: '1', type: 'receipt' as const, title: 'BigBasket', amount: '-₹2,450', description: 'Groceries · 2 hours ago' },
	{ id: '2', type: 'invoice' as const, title: 'INV-104', amount: '+₹7,670', description: 'Rajesh Kumar · Sent · 5 hours ago', status: 'Sent' },
	{ id: '3', type: 'expense' as const, title: 'Petrol', amount: '-₹800', description: 'Shell Station · 1 day ago' },
	{ id: '4', type: 'invoice' as const, title: 'INV-103', amount: '+₹3,200', description: 'Priya Sharma · Paid · 2 days ago', status: 'Paid' },
 ]

 return (
	<DashboardShell>
		<div className="space-y-6">
			{/* Greeting */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">Namaste, Rajesh 👋</h1>
				<p className="text-gray-500 mt-1">Rajesh Graphics · Freelancer</p>
			</div>

			{/* Stats Cards */}
			{stats && (
				<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
					<StatsCard
						title="Income"
						value={`₹${stats.totalIncome.toLocaleString('en-IN')}`}
						trend={stats.incomeTrend}
						trendUp={true}
						icon={<TrendingUp className="w-5 h-5" />}
						color="success"
					/>
					<StatsCard
						title="Expenses"
						value={`₹${stats.totalExpenses.toLocaleString('en-IN')}`}
						trend={stats.expenseTrend}
						trendUp={true}
						icon={<TrendingDown className="w-5 h-5" />}
						color="error"
					/>
					<StatsCard
						title="Pending Invoices"
						value={stats.pendingInvoices.toString()}
						trend={`₹${stats.pendingAmount.toLocaleString('en-IN')} due`}
						trendUp={false}
						icon={<FileText className="w-5 h-5" />}
						color="accent"
					/>
					<StatsCard
						title="GST Due"
						value={`₹${stats.gstDue.toLocaleString('en-IN')}`}
						trend="File soon"
						trendUp={false}
						icon={<Receipt className="w-5 h-5" />}
						color="primary"
					/>
				</div>
			)}

			{/* Charts */}
			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="text-base flex items-center gap-2">
							<BarChart3 className="w-5 h-5 text-primary-500" />
							Income vs Expenses
						</CardTitle>
					</CardHeader>
					<CardContent>
						{monthlyData.length > 0 ? (
							<div className="h-[250px]">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={monthlyData}>
										<defs>
											<linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
												<stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
											</linearGradient>
											<linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3}/>
												<stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
										<XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
										<YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
										<Tooltip
											formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
											contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
										/>
										<Area type="monotone" dataKey="income" stroke="#10B981" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
										<Area type="monotone" dataKey="expenses" stroke="#F43F5E" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
									</AreaChart>
								</ResponsiveContainer>
							</div>
						) : (
							<div className="h-[250px] flex items-center justify-center text-sm text-gray-400">
								No data available yet
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-base">Category Spend</CardTitle>
					</CardHeader>
					<CardContent>
						{categorySpend.length === 0 ? (
							<p className="text-sm text-gray-400 text-center py-8">No expenses recorded yet</p>
						) : (
							<div className="space-y-3">
								{categorySpend.map((cat, i) => (
									<div key={i}>
										<div className="flex items-center justify-between text-sm mb-1">
											<span className="text-gray-700">{cat.name}</span>
											<span className="font-medium text-gray-900 text-xs">₹{cat.amount.toLocaleString('en-IN')} ({cat.percentage}%)</span>
										</div>
										<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
											<div className="h-full bg-primary-500 rounded-full" style={{ width: `${cat.percentage}%` }} />
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<Card>
				<div className="flex items-center justify-between p-4 pb-2">
					<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
					<button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
						View All
					</button>
				</div>
				<CardContent className="px-4">
					<RecentTransactions transactions={recentTransactions} />
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
					<Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push('/receipts')}>
						<Receipt className="w-5 h-5 text-primary-500" />
						<span className="text-sm font-medium">Scan Receipt</span>
					</Button>
					<Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push('/invoices')}>
						<FileText className="w-5 h-5 text-success-500" />
						<span className="text-sm font-medium">New Invoice</span>
					</Button>
					<Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push('/expenses')}>
						<Wallet className="w-5 h-5 text-error-500" />
						<span className="text-sm font-medium">Add Expense</span>
					</Button>
					<Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => router.push('/gst')}>
						<AlertTriangle className="w-5 h-5 text-accent-500" />
						<span className="text-sm font-medium">GST Report</span>
					</Button>
				</div>
			</div>
		</div>
	</DashboardShell>
 )
}
