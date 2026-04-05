export const dynamic = "force-dynamic";

const FEEDBACK_API_URL =
  process.env.FEEDBACK_API_URL ?? "http://localhost:3005";

export async function GET() {
  const res = await fetch(`${FEEDBACK_API_URL}/conversations`);
  const data = await res.json();
  return Response.json(data);
}
