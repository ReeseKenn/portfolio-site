import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const localPath = resolve(root, "src/content/siteContent.local.json");
const examplePath = resolve(root, "src/content/siteContent.example.json");
const outputPath = resolve(root, "src/content/siteContent.generated.ts");
const sourcePath = existsSync(localPath) ? localPath : examplePath;

const rawContent = await readFile(sourcePath, "utf-8");
const parsedContent = JSON.parse(rawContent);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(
  outputPath,
  [
    "import type { SiteContent } from './types';",
    "",
    `const siteContent = ${JSON.stringify(parsedContent, null, 2)} satisfies SiteContent;`,
    "",
    "export default siteContent;",
    ""
  ].join("\n"),
  "utf-8"
);

console.log(`Generated content from ${sourcePath.endsWith("siteContent.local.json") ? "local" : "example"} file.`);
