#!/usr/bin/env node --experimental-strip-types

import builder from "./builder.ts";
//@ts-ignore
import ora from "ora";
//@ts-ignore
import fs from "fs";

(async function () {
  const src = "src";
  const out = "docs";

  try {
    const spinner = ora("Building...").start();
    if (fs.existsSync(out)) {
      fs.rmSync(out, { recursive: true });
    }
    await builder.build({ themeDir: "./theme/" });
    spinner.succeed(`Built ./${src} to ./${out}.`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();