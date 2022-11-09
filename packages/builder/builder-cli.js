#!/usr/bin/env node

import builder from "./builder.js";
import ora from "ora";
import fs from "fs";

(async function () {
  const src = "src";
  const out = "docs";

  const spinner = ora("Building...").start();
  fs.rmdirSync(out, { recursive: true });
  await builder.build({ themeDir: "./theme/" });
  spinner.succeed(`Built ./${src} to ./${out}.`);
})();
