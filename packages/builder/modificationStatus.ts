import { execSync } from "child_process";
import { extend } from "./util.ts";

function log(x) {
  console.log(x);
  return x;
}

export function getChangedFiles(
  src: string = ""
): Map<string, "modified" | "created"> {
  const command = `git status --porcelain`;
  const diffOutput = execSync(command).toString();
  const changeList = diffOutput
    .toString()
    .trim()
    .split("\n")
    .map((x) => [x.substring(0, 2), x.substring(2).trim()])
    .filter(([status, file]) => {
      // M modified, ?? untracked
      return (
        // modified, unstaged
        (status === " M" ||
          // modified, staged
          status === "M " ||
          // added, unstaged
          status === "A " ||
          // added, staged
          status === "??") &&
        // in 'src/' for example
        file.indexOf(src) === 0
      );
    })
    .map(([status, file]) => {
      switch (status.trim()) {
        case "M":
          return { status: "modified", file };
        case "??":
        case "A":
          return { status: "created", file };
        default:
          throw new Error("this should never happen");
      }
    });

  const result = new Map();
  for (const change of changeList) {
    result.set(change.file, change.status);
  }

  return result;
}

let gitInfo: Map<string, "modified" | "created"> | null;

export function motificationStatus(page: Record<string, any>) {
  if (gitInfo == null) {
    gitInfo = getChangedFiles();
  }

  extend(page, {
    gitStatus: gitInfo.get(page.path) ?? "--",
  });
}
