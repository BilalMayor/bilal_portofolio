import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import chatHandler from "./api/chat.js";

// ── Local Upload Plugin ─────────────────────────────────────────────
// Handles POST /api/upload-local during Vite dev server.
function localUploadPlugin() {
  return {
    name: "local-upload-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || req.url !== "/api/upload-local") {
          return next();
        }

        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", () => {
          try {
            const { filename, data, folder = "gallery" } = JSON.parse(body);

            // Strip the base64 header
            const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            // 1. Save into src/assets/<folder>/ — persisted in workspace
            const assetsDir = join(process.cwd(), "src", "assets", folder);
            mkdirSync(assetsDir, { recursive: true });
            writeFileSync(join(assetsDir, filename), buffer);

            // 2. Save into public/<folder>/ — immediately served as static URL
            const publicDir = join(process.cwd(), "public", folder);
            mkdirSync(publicDir, { recursive: true });
            writeFileSync(join(publicDir, filename), buffer);

            const url = `/${folder}/${filename}`;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ url }));
          } catch (err) {
            console.error("[local-upload] Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Upload failed" }));
          }
        });
      });
    },
  };
}

// ── Local Chat API Plugin ──────────────────────────────────────────
// Emulates Vercel Serverless Function /api/chat during local development
function localChatApiPlugin() {
  return {
    name: "local-chat-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "POST" || req.url !== "/api/chat") {
          return next();
        }

        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            const fakeReq = {
              method: "POST",
              headers: req.headers,
              socket: req.socket,
              body: parsedBody,
            };

            const fakeRes = {
              statusCode: 200,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(data) {
                res.writeHead(this.statusCode || 200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(data));
              },
            };

            await chatHandler(fakeReq, fakeRes);
          } catch (err) {
            console.error("[local-chat-api] Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Internal Server Error" }));
          }
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env = { ...process.env, ...env };

  return {
    plugins: [react(), tailwindcss(), localUploadPlugin(), localChatApiPlugin()],
    build: {
      target: "esnext",
      minify: "esbuild",
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("three")) {
                return "vendor-three";
              }
              if (id.includes("firebase")) {
                return "vendor-firebase";
              }
            }
          },
        },
      },
    },
  };
});
