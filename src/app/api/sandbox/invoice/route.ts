import { NextRequest, NextResponse } from "next/server";

const INVOICES: Record<string, { id: number; user_id: number; user: string; item: string; total: number }> = {
  "100": { id: 100, user_id: 1, user: "admin", item: "SSL Certificate Renewal", total: 129.99 },
  "101": { id: 101, user_id: 1, user: "admin", item: "Security Audit", total: 249.99 },
  "102": { id: 102, user_id: 2, user: "john_doe", item: "Penetration Test", total: 799.99 },
  "103": { id: 103, user_id: 3, user: "jane_smith", item: "Firewall Configuration", total: 349.99 },
  "104": { id: 104, user_id: 4, user: "bob_harris", item: "Cloud Storage Setup", total: 499.99 },
  "200": { id: 200, user_id: 5, user: "alice_wong", item: "Enterprise Migration", total: 2499.99 },
};

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Invoice ID required" }, { status: 400 });
  }

  const invoice = INVOICES[id];

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json(invoice);
}
