import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { writeFileSync, mkdirSync, realpathSync } from "fs";
import { basename, resolve, extname } from "path";

// ── Local Upload Plugin ─────────────────────────────────────────────
// Handles POST /api/upload-local during Vite dev server with strict security checks.
const ALLOWED_FOLDERS = new Set(["gallery", "projects", "achievements", "cards", "uploads"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif", ".avif"]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB limit

function localUploadPlugin() {
  return {
    name: "local-upload-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== "POST" || req.url !== "/api/upload-local") {
          return next();
        }

        // CSRF Defense: Only allow requests originating from localhost / same-origin
        const origin = req.headers["origin"] || req.headers["referer"];
        if (origin) {
          try {
            const urlObj = new URL(origin);
            const isLocal =
              urlObj.hostname === "localhost" ||
              urlObj.hostname === "127.0.0.1" ||
              urlObj.hostname === "::1";
            if (!isLocal) {
              res.writeHead(403, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Forbidden: Cross-origin upload rejected" }));
              return;
            }
          } catch {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid Origin header" }));
            return;
          }
        }

        let body = "";
        let totalSize = 0;

        req.on("data", (chunk) => {
          totalSize += chunk.length;
          if (totalSize > 15 * 1024 * 1024) {
            req.destroy();
          } else {
            body += chunk.toString();
          }
        });

        req.on("end", () => {
          try {
            if (!body) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Empty request body" }));
            }

            const { filename: rawFilename, data, folder: rawFolder = "gallery" } = JSON.parse(body);

            // 1. Validate & Whitelist Target Folder (Prevents Path Traversal)
            const cleanFolder = String(rawFolder).toLowerCase().trim();
            if (!ALLOWED_FOLDERS.has(cleanFolder)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid upload folder target" }));
            }

            // 2. Validate & Sanitize Filename (Prevents Path Traversal & Arbitrary Execution)
            if (!rawFilename || typeof rawFilename !== "string") {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid filename" }));
            }

            const safeBaseName = basename(rawFilename).replace(/[^a-zA-Z0-9._-]/g, "_");
            const ext = extname(safeBaseName).toLowerCase();
            if (!ALLOWED_EXTENSIONS.has(ext)) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Forbidden file type. Only image files allowed." }));
            }

            // 3. Strip data URL header and decode buffer
            if (!data || typeof data !== "string") {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Missing image data" }));
            }

            const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");

            if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
              res.writeHead(400, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Invalid file size (max 10MB)" }));
            }

            // 4. Strictly Verify Absolute Directory Boundaries
            const workspaceRoot = realpathSync(process.cwd());
            const assetsDir = resolve(workspaceRoot, "src", "assets", cleanFolder);
            const publicDir = resolve(workspaceRoot, "public", cleanFolder);

            const destAssetPath = resolve(assetsDir, safeBaseName);
            const destPublicPath = resolve(publicDir, safeBaseName);

            if (!destAssetPath.startsWith(assetsDir) || !destPublicPath.startsWith(publicDir)) {
              res.writeHead(403, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ error: "Security violation: Path Traversal detected" }));
            }

            // 5. Persist file safely
            mkdirSync(assetsDir, { recursive: true });
            writeFileSync(destAssetPath, buffer);

            mkdirSync(publicDir, { recursive: true });
            writeFileSync(destPublicPath, buffer);

            const url = `/${cleanFolder}/${safeBaseName}`;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ url }));
          } catch (err) {
            console.error("[local-upload] Error:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Upload failed securely" }));
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

            const { default: chatHandler } = await import("./api/chat.js");
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
  const rootDir = realpathSync(process.cwd());
  const env = loadEnv(mode, rootDir, "");
  process.env = { ...process.env, ...env };

  return {
    root: rootDir,
    server: {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    },
    plugins: [react(), tailwindcss(), localUploadPlugin(), localChatApiPlugin()],
    build: {
      target: "esnext",
      minify: "esbuild",
      cssMinify: true,
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("@dimforge") || id.includes("@react-three/rapier")) {
                return "vendor-rapier";
              }
              if (id.includes("@react-three/drei")) {
                return "vendor-three-drei";
              }
              if (id.includes("@react-three/fiber")) {
                return "vendor-three-fiber";
              }
              if (id.includes("three")) {
                return "vendor-three";
              }
              if (id.includes("firebase")) {
                return "vendor-firebase";
              }
              if (id.includes("lucide-react") || id.includes("remixicon")) {
                return "vendor-icons";
              }
              if (id.includes("gsap") || id.includes("@gsap")) {
                return "vendor-gsap";
              }
              if (id.includes("motion")) {
                return "vendor-motion";
              }
            }
          },
        },
      },
    },
  };
});
