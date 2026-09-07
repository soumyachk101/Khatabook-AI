"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const defaultCategories = [
 { id: "1", name: "Rent", icon: "🏠", color: "#6366F1", type: "expense" },
 { id: "2", name: "Fuel", icon: "⛽", color: "#F59E0B", type: "expense" },
 { id: "3", name: "Utilities", icon: "💡", color: "#10B981", type: "expense" },
 { id: "4", name: "Supplies", icon: "📦", color: "#EF4444", type: "expense" },
 { id: "5", name: "Salary", icon: "👥", color: "#8B5CF6", type: "expense" },
 { id: "6", name: "Sales", icon: "💰", color: "#10B981", type: "income" },
];

function CategoryManager() {
 const [categories, setCategories] = React.useState(defaultCategories);
 const [showForm, setShowForm] = React.useState(false);
 const [form, setForm] = React.useState({ name: "", icon: "📁", color: "#6366F1", type: "expense" });

 const addCategory = () => {
 if (!form.name) return;
 setCategories([...categories, { ...form, id: Date.now().toString() }]);
 setForm({ name: "", icon: "📁", color: "#6366F1", type: "expense" });
 setShowForm(false);
 };

 const deleteCategory = (id: string) => setCategories(categories.filter(c => c.id !== id));

 return (
 <div className="max-w-2xl mx-auto space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold">Categories</h1>
 <p className="text-muted-foreground">Manage expense and income categories</p>
 </div>
 <Button onClick={() => setShowForm(!showForm)}><Plus className="mr-2 size-4" /> Add Category</Button>
 </div>

 {showForm && (
 <Card className="p-6">
 <h3 className="font-semibold mb-4">New Category</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
 <div className="space-y-2"><Label>Icon (emoji)</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></div>
 <div className="space-y-2"><Label>Color</Label><input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-9 w-full rounded-md border" /></div>
 <div className="space-y-2"><Label>Type</Label>
 <select className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "expense" | "income" })}>
 <option value="expense">Expense</option>
 <option value="income">Income</option>
 </select>
 </div>
 </div>
 <div className="flex gap-2 mt-4">
 <Button onClick={addCategory}>Add</Button>
 <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
 </div>
 </Card>
 )}

 <Card className="p-6">
 <div className="space-y-3">
 {categories.map((cat) => (
 <div key={cat.id} className="flex items-center justify-between py-3 border-b last:border-0">
 <div className="flex items-center gap-3">
 <span className="text-2xl">{cat.icon}</span>
 <div>
 <p className="font-medium text-sm">{cat.name}</p>
 <span className="text-xs text-muted-foreground capitalize">{cat.type}</span>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
 <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}><Trash2 className="size-4 text-destructive" /></Button>
 </div>
 </div>
 ))}
 </div>
 </Card>
 </div>
 );
}

export { CategoryManager };
