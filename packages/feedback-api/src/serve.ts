import { serve } from "@hono/node-server";
import { app } from "./index";

const port = Number(process.env.FEEDBACK_API_PORT ?? 3002);

serve({ fetch: app.fetch, port }, () => {
  console.log(`[feedback-api] listening on http://localhost:${port}`);
});
