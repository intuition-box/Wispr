import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import chat from "./routes/chat";

const app = new Hono();

app.use("/*", cors());

// Mount routes under /api
app.route("/api", chat);

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`[wispr-api] listening on http://localhost:${port}`);
});

export default app;
