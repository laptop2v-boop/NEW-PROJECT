// Lists every photo that js/data.js refers to and whether the file exists.
// Run from the project folder:   node tools/check-images.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "js", "data.js"), "utf8"), ctx);
let missing = 0, found = 0;
for (const p of ctx.window.PRODUCTS) {
  console.log("\n" + p.name);
  for (const img of p.images || []) {
    const ok = fs.existsSync(path.join(root, img.replace(/^\/+/, "")));
    ok ? found++ : missing++;
    console.log("  " + (ok ? "found    " : "MISSING  ") + img);
  }
}
console.log("\n" + found + " found, " + missing + " missing.");
console.log(missing ? "Missing photos show a clean placeholder on the site until the files are added." : "All listed photos exist.");
