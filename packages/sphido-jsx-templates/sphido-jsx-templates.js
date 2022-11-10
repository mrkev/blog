const babel = require("@babel/core");
const { existsSync, outputFile, readFileSync } = require("fs-extra");
const path = require("path");
const prettify = require("html-prettify");

const kebabize = (str) => {
  return str
    .split("")
    .map((letter, idx) => {
      return letter.toUpperCase() === letter
        ? `${idx !== 0 ? "-" : ""}${letter.toLowerCase()}`
        : letter;
    })
    .join("");
};

function transformTemplate(templateCode) {
  return new Promise(function (res, rej) {
    const code = "/** @jsx JSXT.elem */" + templateCode;
    babel.transform(
      code,
      {
        plugins: ["@babel/transform-react-jsx"],
      },
      function (err, result) {
        if (err) rej(err);
        else res(result);
      }
    );
  });
}

class JSXTElem {
  constructor(type, args, children) {
    this.type = type;
    this.args = args;
    this.children = children;
  }
}

class JSXT {
  // The last element will be our root element, becasue JS evaluates
  // arguments before it evaluates the parent (duh)
  lastElement = null;
  static elem(type, args, ...children) {
    if (typeof type !== "string") {
      throw new Error(
        "Only HTML elements are supported in templates at " +
          "the moment. Make sure they're lowercase too"
      );
    }

    const element = new JSXTElem(type, args, children);
    this.lastElement = element;
    return element;
  }

  static commit() {
    let depth = 0;
    function renderRecursive(elem) {
      // Null children can happen, ie <div>{obj.nonExistingKey}</div>
      // TODO: probably remove this since I filter children below now
      if (elem == null) {
        return "";
      }

      // Arrays are rendered recursivley
      if (Array.isArray(elem)) {
        depth++;
        const renderedChildren = elem.map(renderRecursive).join("");
        depth--;
        return renderedChildren;
      }

      // Booleans, like in React, render nothing
      if (typeof elem === "boolean") {
        return "";
      }

      // Base case, text, etc children
      if (!(elem instanceof JSXTElem)) {
        return String(elem);
      }

      const { type, args } = elem;
      const children = elem.children.filter((x) => x != null);
      const renderedArgs = Object.keys(args || {})
        .map((key) => {
          const arg = args[key];
          let str = String(arg);
          if (typeof arg === "object" && key === "style") {
            str = "";
            for (const key in arg) {
              str += `${kebabize(key)}:${String(arg[key])};`;
            }
          }

          return `${key}="${str}"`; // TODO, type of args[key]
        })
        .join(" ");

      depth++;
      const renderedChildren = children.map(renderRecursive).join("");
      depth--;

      const shouldNewline =
        children.length > 1 ||
        (children.length === 1 && typeof children[0] !== "string");

      const padding = "".padStart(depth * 2, " ");
      return `\n${padding}<${type}${
        renderedArgs.length ? " " + renderedArgs : ""
      }>${
        shouldNewline ? renderedChildren + `\n${padding}` : renderedChildren
      }</${type}>`;
    }

    const result = renderRecursive(this.lastElement);

    // In this house we clean our state
    // this.lastElement = null;
    return result;
  }
}

async function renderString(templateCode, vars) {
  const transformed = await transformTemplate(templateCode);
  const evalFn = new Function("JSXT", "page", transformed.code);
  evalFn(JSXT, vars);
  const rendered = "<!DOCTYPE html>" + JSXT.commit();
  return rendered;
}

module.exports = {
  renderString,
  async renderToFile(file, template, { vars }) {
    const maybePath = path.join(process.cwd(), template);
    const templateIsFile = existsSync(maybePath);
    const templateStr = templateIsFile
      ? readFileSync(maybePath, { encoding: "utf-8" })
      : template;

    const rendered = await renderString(templateStr, vars);
    await outputFile(file, rendered);
  },
};
