#!/usr/bin/env tsx
// =============================================================================
// Khatabook-AI — Prisma Migration Runner
// =============================================================================
// Usage:
// npx tsx scripts/migrate.ts # Apply pending migrations (production)
// npx tsx scripts/migrate.ts --create "Add payment table" # Create + apply (dev)
// npx tsx scripts/migrate.ts --reset # Reset DB + re-apply all (dev only!)
// npx tsx scripts/migrate.ts --status # Show migration status
// =============================================================================

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── Resolve paths relative to this script's location ──────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_DIR = path.resolve(__dirname, "..");
const PRISMA_DIR = path.resolve(BACKEND_DIR, "prisma");

// ── Helpers ───────────────────────────────────────────────────────────────────
function execPrisma(args: string[]): Promise<void> {
 return new Promise((resolve, reject) => {
 const child = spawn("npx", ["prisma", ...args], {
 cwd: BACKEND_DIR,
 stdio: "inherit",
 shell: true,
 });

 child.on("close", (code) => {
 if (code === 0) {
 resolve();
 } else {
 reject(new Error(`prisma ${args.join(" ")} exited with code ${code}`));
 }
 });
 });
}

function printUsage() {
 console.log(`
Khatabook-AI Migration Runner

Usage:
 npx tsx scripts/migrate.ts Apply pending migrations
 npx tsx scripts/migrate.ts --create <name> Create & apply new migration
 npx tsx scripts/migrate.ts --reset Reset DB (WARNING: data loss)
 npx tsx scripts/migrate.ts --status Show migration status
 npx tsx scripts/migrate.ts --studio Open Prisma Studio
 npx tsx scripts/migrate.ts --generate Regenerate Prisma Client

Examples:
 npx tsx scripts/migrate.ts --create "add-receipt-tags"
`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
 const args = process.argv.slice(2);

 if (args.includes("--help") || args.includes("-h")) {
 printUsage();
 process.exit(0);
 }

 const createIndex = args.indexOf("--create");
 if (createIndex !== -1) {
 const name = args[createIndex + 1];
 if (!name) {
 console.error("Error: --create requires a migration name.");
 console.error('Example: npx tsx scripts/migrate.ts --create "add-receipt-tags"');
 process.exit(1);
 }
 console.log(`Creating migration: ${name}`);
 await execPrisma(["migrate", "dev", "--name", name]);
 return;
 }

 if (args.includes("--reset")) {
 console.warn(
 "\n⚠️ WARNING: This will DELETE all data in the database.\n"
 );
 process.stdout.write("Type 'yes' to confirm: ");
 const answer = await new Promise<string>((resolve) => {
 process.stdin.once("data", (d) => resolve(d.toString().trim()));
 });
 if (answer !== "yes") {
 console.log("Aborted.");
 process.exit(0);
 }
 console.log("Resetting database...");
 await execPrisma(["migrate", "reset"]);
 return;
 }

 if (args.includes("--status")) {
 await execPrisma(["migrate", "status"]);
 return;
 }

 if (args.includes("--studio")) {
 await execPrisma(["studio"]);
 return;
 }

 if (args.includes("--generate")) {
 console.log("Regenerating Prisma Client...");
 await execPrisma(["generate"]);
 return;
 }

 // Default: deploy pending migrations
 console.log("Applying pending migrations...");
 await execPrisma(["migrate", "deploy"]);
 console.log("✅ Migrations applied successfully.");
}

main().catch((err) => {
 console.error(`\n❌ Migration failed: ${err.message}\n`);
 process.exit(1);
});
