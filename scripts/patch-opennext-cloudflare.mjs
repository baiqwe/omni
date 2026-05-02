import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [
  path.join(root, ".open-next", "server-functions", "default", "index.mjs"),
  path.join(root, ".open-next", "server-functions", "default", "handler.mjs"),
];

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  const original = fs.readFileSync(filePath, "utf8");
  let patched = original
    .replace('globalThis.monorepoPackagePath = "";', 'globalThis.monorepoPackagePath = ".";')
    .replace('globalThis.monorepoPackagePath="";', 'globalThis.monorepoPackagePath=".";')
    .replace('process.chdir("")', 'process.chdir(".")');

  if (patched === original) {
    return false;
  }

  fs.writeFileSync(filePath, patched);
  return true;
}

const patchedFiles = targets.filter(patchFile);

if (patchedFiles.length > 0) {
  console.log(`Patched OpenNext working directory in ${patchedFiles.length} file(s).`);
} else {
  console.log("OpenNext patch skipped: no matching runtime strings found.");
}
