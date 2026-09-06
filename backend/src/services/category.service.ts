import { supabase } from "../utils/supabase";
import { Errors } from "../utils/response";
import { Category } from "../types";

export class CategoryService {
 private userId: string;

 constructor(userId: string) {
 this.userId = userId;
 }

 /**
 * List all categories (system defaults + user's custom categories)
 */
 async listCategories(type?: "income" | "expense" | "transfer"): Promise<{ income: Category[]; expense: Category[]; transfer: Category[] }> {
 let query = supabase
 .from("categories")
 .select("*")
 .eq("is_active", true)
 .order("name");

 if (type) {
 query = query.eq("type", type);
 }

 const { data, error } = await query;

 if (error) {
 throw new Error(`Failed to list categories: ${error.message}`);
 }

 const income = (data || []).filter((c) => c.type === "income");
 const expense = (data || []).filter((c) => c.type === "expense");
 const transfer = (data || []).filter((c) => c.type === "transfer");

 return { income, expense, transfer };
 }

 /**
 * Create a custom category
 */
 async createCategory(input: {
 name: string;
 type: "income" | "expense" | "transfer";
 color?: string;
 icon?: string;
 parent_id?: string;
 category_group?: string;
 hsn_code?: string;
 gst_rate?: number;
 }): Promise<Category> {
 const { data, error } = await supabase
 .from("categories")
 .insert({
 owner_id: this.userId,
 name: input.name,
 slug: input.name.toLowerCase().replace(/\s+/g, "-"),
 type: input.type,
 color: input.color || "#6B7280",
 icon: input.icon,
 parent_id: input.parent_id,
 category_group: input.category_group,
 hsn_code: input.hsn_code,
 gst_rate: input.gst_rate || 0,
 is_system_default: false,
 is_active: true,
 created_at: new Date().toISOString(),
 })
 .select()
 .single();

 if (error) {
 if (error.code === "23505") {
 throw Errors.conflict("Category with this name already exists");
 }
 throw new Error(`Failed to create category: ${error.message}`);
 }

 return data;
 }

 /**
 * Update category
 */
 async updateCategory(categoryId: string, updates: Partial<Category>): Promise<Category> {
 // Prevent updating system categories
 const { data: existing } = await supabase
 .from("categories")
 .select("is_system_default")
 .eq("id", categoryId)
 .single();

 if (existing?.is_system_default) {
 throw Errors.conflict("Cannot modify system default categories");
 }

 const { data, error } = await supabase
 .from("categories")
 .update(updates)
 .eq("id", categoryId)
 .eq("owner_id", this.userId)
 .select()
 .single();

 if (error) {
 throw new Error(`Failed to update category: ${error.message}`);
 }

 if (!data) {
 throw Errors.notFound("Category not found");
 }

 return data;
 }

 /**
 * Delete category
 */
 async deleteCategory(categoryId: string): Promise<void> {
 const { data: existing } = await supabase
 .from("categories")
 .select("is_system_default")
 .eq("id", categoryId)
 .single();

 if (existing?.is_system_default) {
 throw Errors.conflict("Cannot delete system default categories");
 }

 // Set expenses with this category to null
 await supabase
 .from("expenses")
 .update({ category_id: null })
 .eq("category_id", categoryId);

 const { error } = await supabase
 .from("categories")
 .delete()
 .eq("id", categoryId)
 .eq("owner_id", this.userId);

 if (error) {
 throw new Error(`Failed to delete category: ${error.message}`);
 }
 }
}
