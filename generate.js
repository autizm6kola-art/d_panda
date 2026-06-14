const fs = require("fs");

const inputFile = "input.txt";
const outputFile = "tasks.json";

const content = fs.readFileSync(inputFile, "utf8");

const pages = content.match(
  /--- PAGE START ---[\s\S]*?--- PAGE END ---/g
) || [];

const tasks = pages.map((page, index) => {
  const titleMatch = page.match(/#TITLE:\s*(.+)/);

  const title = titleMatch
    ? titleMatch[1].trim()
    : String(index + 1);

  let text = page
    .replace(/--- PAGE START ---/, "")
    .replace(/--- PAGE END ---/, "")
    .replace(/#TITLE:.+/, "")
    .trim();

  return {
    id: index + 1,
    title,
    text
  };
});

fs.writeFileSync(
  outputFile,
  JSON.stringify(tasks, null, 2),
  "utf8"
);

console.log(`Создано ${tasks.length} заданий.`);