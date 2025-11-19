// app/api/aurix/route.js
import { NextResponse } from "next/server";
import { createSession, add, getRecent, clearSession, exportSession } from "../../../../aurix/core/memory.js";
import { AurixEngine } from "../../../../aurix/core/engine.js";

export const runtime = "edge";

function makeSessionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const action = body?.action;
    const payload = body?.payload || {};

    // session handling
    let sessionId = body?.sessionId || makeSessionId();
    await createSession(sessionId);

    // memory-management actions
    if (action === "memory.add") {
      const saved = await add(sessionId, payload);
      return NextResponse.json({ ok: true, sessionId, saved });
    }

    if (action === "memory.recent") {
      const items = await getRecent(sessionId, payload?.count || 10);
      return NextResponse.json({ ok: true, sessionId, items });
    }

    if (action === "memory.export") {
      const items = await exportSession(sessionId);
      return NextResponse.json({ ok: true, sessionId, items });
    }

    if (action === "memory.clear") {
      await clearSession(sessionId);
      return NextResponse.json({ ok: true, sessionId });
    }

    // chat / processing
    if (action === "chat" || action === "process") {
      const message = payload?.message || payload?.text || body?.message;
      if (!message) return NextResponse.json({ error: "message required" }, { status: 400 });

      // processa com engine (intents -> router -> orchestrator -> LLM)
      const engine = AurixEngine.getInstance();
      const result = await engine.process(sessionId, message, { mode: body?.mode || "text" });

      return NextResponse.json({ ok: true, sessionId, result });
    }

    return NextResponse.json({ error: "invalid action" }, { status: 400 });

  } catch (err) {
    console.error("Aurix route error:", err);
    return NextResponse.json({ error: "internal", details: err.message }, { status: 500 });
  }
}

