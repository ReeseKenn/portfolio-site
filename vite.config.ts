import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { defineConfig, normalizePath, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const execFileAsync = promisify(execFile);
const contentFiles = [
  normalizePath(resolve(process.cwd(), "src/content/siteContent.local.json")),
  normalizePath(resolve(process.cwd(), "src/content/siteContent.example.json"))
];
const generateContentScript = resolve(process.cwd(), "scripts/generate-content.mjs");

function contentHotReloadPlugin(): Plugin {
  let generateQueue = Promise.resolve();

  const generateContent = async (reason: string) => {
    const { stdout, stderr } = await execFileAsync(process.execPath, [generateContentScript], {
      cwd: process.cwd()
    });

    if (stdout.trim()) {
      console.log(stdout.trim());
    }

    if (stderr.trim()) {
      console.error(stderr.trim());
    }

    console.log(`Content regenerated after ${reason}.`);
  };

  const enqueueGenerate = (reason: string, onDone?: () => void) => {
    generateQueue = generateQueue
      .then(() => generateContent(reason))
      .then(() => {
        onDone?.();
      })
      .catch((error) => {
        console.error("Failed to regenerate content.");
        console.error(error);
      });
  };

  const isContentFile = (filePath: string) => contentFiles.includes(normalizePath(filePath));

  return {
    name: "portfolio-content-hot-reload",
    apply: "serve",
    async buildStart() {
      await generateContent("dev server startup");
    },
    configureServer(server) {
      server.watcher.add(contentFiles);

      const handleContentChange = (filePath: string) => {
        if (!isContentFile(filePath)) {
          return;
        }

        enqueueGenerate(`content file change: ${filePath}`, () => {
          server.ws.send({ type: "full-reload" });
        });
      };

      server.watcher.on("add", handleContentChange);
      server.watcher.on("change", handleContentChange);
      server.watcher.on("unlink", handleContentChange);
    }
  };
}

export default defineConfig({
  plugins: [contentHotReloadPlugin(), react()],
  base: "/"
});
