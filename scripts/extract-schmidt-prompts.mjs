import fs from "fs";

export function extractAllSchmidtPrompts(sourcePath) {
  const raw = fs.readFileSync(sourcePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const prompts = {};

  let i = 0;
  while (i < lines.length) {
    const head = lines[i].match(/^####\s*(\d+)\s*$/);
    if (head) {
      const num = Number(head[1]);
      i++;
      const promptLines = [];
      while (i < lines.length && !lines[i].match(/^####\s*\d+/)) {
        if (lines[i].match(/^-\s/)) break;
        const t = lines[i].replace(/\[cite:[^\]]+\]/g, "").trim();
        if (t && !t.startsWith("---") && !t.startsWith("###")) promptLines.push(t);
        i++;
      }
      if (promptLines.length) prompts[num] = promptLines.join(" ");
      continue;
    }
    i++;
  }

  const l2Start = lines.findIndex((l) => l.includes("Fragen 41"));
  let j = l2Start;
  while (j < lines.length) {
    const numM = lines[j].match(/^(\d+)\s*$/);
    if (numM) {
      const num = Number(numM[1]);
      if (num >= 41 && num <= 43) {
        j++;
        const promptLines = [];
        while (j < lines.length) {
          const opt = lines[j].match(/^([A-D])\)\s*(.+)$/);
          if (opt) {
            j++;
            continue;
          }
          if (lines[j].match(/^\d+\s*$/) || lines[j].includes("Lösungen")) break;
          if (lines[j].trim()) promptLines.push(lines[j].trim());
          j++;
        }
        if (promptLines.length) prompts[num] = promptLines.join(" ");
        continue;
      }
    }
    if (lines[j].startsWith("Lektionsteil: Lösungen") && j > l2Start + 10) break;
    j++;
  }

  return prompts;
}

if (process.argv[1]?.endsWith("extract-schmidt-prompts.mjs")) {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: node extract-schmidt-prompts.mjs <txt>");
    process.exit(1);
  }
  const p = extractAllSchmidtPrompts(path);
  console.log(JSON.stringify(p, null, 2));
}
