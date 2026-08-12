// scripts/toml-watcher.mjs
import path from "node:path";
import * as toml from "toml";
import { promises as fs } from "node:fs";
import { watch } from "node:fs";
import { fileURLToPath } from "node:url";
import { pathExists, atomicWrite, ensureDir } from "shared/fs";
import { debounce } from "shared/debounce";
import { log, warn, error } from "shared/logger";

// ---------- Cross-platform root ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ---------- Paths ----------
const configFilePath = path.resolve(
  PROJECT_ROOT,
  "src",
  "config",
  "config.toml",
);

const outputDir = path.resolve(PROJECT_ROOT, "src/config");
const outputFilePath = path.join(outputDir, "config.generated.json");

// ---------- Core conversion ----------
async function convertTomlToJson() {
  try {
    const content = await fs.readFile(configFilePath, "utf8");
    const parsed = toml.parse(content);

    await ensureDir(outputDir);

    await atomicWrite(outputFilePath, JSON.stringify(parsed, null, 2));

    log(`✓ Generated ${outputFilePath}`);
  } catch (err) {
    error("✖ Conversion failed:", err?.message ?? err);
  }
}

const debouncedConvert = debounce(convertTomlToJson, 150);

// ---------- Watch mode ----------
async function watchFile() {
  log("Watching config.toml for changes...");

  let watcher;

  const startWatcher = async () => {
    if (!(await pathExists(configFilePath))) {
      warn("Waiting for config.toml...");
      setTimeout(startWatcher, 1000);
      return;
    }

    watcher = watch(configFilePath, (eventType) => {
      // change event → regenerate config
      if (eventType === "change") {
        debouncedConvert();
      }

      // rename happens when editors replace the file
      if (eventType === "rename") {
        log("File replaced, restarting watcher...");
        watcher.close();
        startWatcher();
      }
    });

    watcher.on("error", (err) => {
      error("Watch error:", err);
      watcher.close();
      setTimeout(startWatcher, 1000);
    });
  };

  await startWatcher();
}

// ---------- Run ----------
(async () => {
  // Always generate once
  await convertTomlToJson();

  // Watch mode
  if (process.argv.includes("--watch")) {
    await watchFile();
  } else {
    process.exit(0);
  }
})();
