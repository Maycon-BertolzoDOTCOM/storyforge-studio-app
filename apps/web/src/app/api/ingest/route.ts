/**
 * Next.js API Route for Ingestion
 * Proxies requests to the Python engine
 */
import { NextRequest, NextResponse } from "next/server";

const ENGINE_URL = process.env.ENGINE_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resp = await fetch(`${ENGINE_URL}/ingest/channel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      return NextResponse.json({ error: `Engine error: ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to engine" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const resp = await fetch(`${ENGINE_URL}/ingest/jobs`);
    if (!resp.ok) {
      return NextResponse.json({ error: `Engine error: ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to engine" }, { status: 500 });
  }
}
