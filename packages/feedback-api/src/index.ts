// Feedback API — no web3 required, accessible to everyone
//
// Collects usage feedback throughout the course of a project
// (called by Wispr Skill during usage).
// Free to consult for curators to broaden/reassess recommendations.
//
// Closes the loop: intent → recommendation → real usage → feedback → better curation
//
// Routes:
//   POST /feedback              Submit feedback signal for a component
//   GET  /feedback/:componentId Get aggregated feedback for a component
//   GET  /feedback/curator/:id  Get feedback relevant to a curator's staked components

import { Hono } from "hono";
import { feedback } from "./routes/feedback";
import { conv } from "./routes/conversations";

const app = new Hono();

app.route("/feedback", feedback);
app.route("/conversations", conv);

export { app };

// DB exports — for direct import in other packages (chat, skill, etc.)
export { db } from "./db";
export * from "./db/schema";
