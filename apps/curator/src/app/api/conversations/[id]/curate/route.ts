const FEEDBACK_API_URL =
  process.env.FEEDBACK_API_URL ?? "http://localhost:3005";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await fetch(`${FEEDBACK_API_URL}/conversations/${id}/curate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
