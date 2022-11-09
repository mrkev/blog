#!/usr/bin/env node -r esm

import builder from "./builder";
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
