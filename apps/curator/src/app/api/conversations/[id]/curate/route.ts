import { db, curationSignals } from "@wispr/feedback-api";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { verdict, comment, curatorAddress } = body;

  if (!verdict || !["good", "bad"].includes(verdict)) {
    return Response.json({ error: "verdict must be 'good' or 'bad'" }, { status: 400 });
  }

  db.insert(curationSignals)
    .values({
      id: crypto.randomUUID(),
      conversationId: id,
      curatorAddress: curatorAddress ?? null,
      verdict,
      comment: comment ?? null,
    })
    .run();

  return Response.json({ ok: true });
}
