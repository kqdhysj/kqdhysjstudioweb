const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const testsOnly = process.argv.includes("--tests-only");
const commands = [];

if (!testsOnly) {
  commands.push({
    label: "JavaScript syntax",
    args: ["--check", path.join(root, "js", "main.js")],
  });
}

const testDirectory = path.join(root, "tests");
const testFiles = fs
  .readdirSync(testDirectory)
  .filter((file) => /^verify-.+\.js$/.test(file))
  .sort();

for (const file of testFiles) {
  commands.push({
    label: file,
    args: [path.join(testDirectory, file)],
  });
}

let failed = false;

for (const command of commands) {
  console.log(`\n== ${command.label} ==`);
  const result = spawnSync(process.execPath, command.args, {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    failed = true;
  }
}

if (failed) {
  console.error("\nVerification failed.");
  process.exit(1);
}

console.log("\nAll verification checks passed.");
