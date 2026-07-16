const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const defaultDestination =
  "C:\\Users\\kqdhysj\\Documents\\Codex\\2026-07-14\\new-chat-2\\outputs\\kqdhysj-studio-portal";
const destination = path.resolve(process.env.KQ_OUTPUT_DIR || defaultDestination);
const destinationParent = path.dirname(destination);

if (
  destination === root ||
  path.basename(destination) !== "kqdhysj-studio-portal" ||
  path.basename(destinationParent) !== "outputs"
) {
  throw new Error(
    "Refusing to sync: destination must be an outputs/kqdhysj-studio-portal directory."
  );
}

const excludedEntries = new Set([".git", "node_modules", "tmp"]);

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (excludedEntries.has(entry.name)) continue;
  fs.cpSync(
    path.join(root, entry.name),
    path.join(destination, entry.name),
    { recursive: true }
  );
}

console.log(`Synced website to ${destination}`);
