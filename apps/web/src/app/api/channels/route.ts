/**
 * Next.js API Route for Channels
 */
import { NextRequest, NextResponse } from "next/server";

const ENGINE_URL = process.env.ENGINE_URL || "http://localhost:8000";

export async function GET() {
  try {
    const resp = await fetch(`${ENGINE_URL}/ingest/channels`);
    if (!resp.ok) {
      return NextResponse.json({ error: `Engine error: ${resp.status}` }, { status: resp.status });
    }
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to engine" }, { status: 500 });
  }
}
