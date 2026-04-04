import { $ } from "bun";

const procs = [
  Bun.spawn(["bun", "run", "index.ts"], {
    cwd: "intuition-mcp-server",
    env: { ...process.env, SERVER_MODE: "http", PORT: "3003" },
    stdout: "inherit",
    stderr: "inherit",
  }),
  Bun.spawn(["bun", "run", "dev"], {
    cwd: "packages/api",
    stdout: "inherit",
    stderr: "inherit",
  }),
  Bun.spawn(["bun", "run", "dev"], {
    cwd: "apps/chat",
    stdout: "inherit",
    stderr: "inherit",
  }),
];

process.on("SIGINT", () => {
  for (const p of procs) p.kill();
  process.exit(0);
});

// Wait for all — if any exits, kill the rest
await Promise.race(procs.map((p) => p.exited));
for (const p of procs) p.kill();
