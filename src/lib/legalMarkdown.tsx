import type { ReactNode } from "react";

// This renderer supports the small, audited Markdown subset used by our policies.
// Text is rendered by React; raw HTML and arbitrary URL schemes are never executed.
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\)|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]}>{link[1]}</a>;
    return part;
  });
}

export function LegalMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.trim().split("\n");
  const blocks: ReactNode[] = [];
  let section = 0;
  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();
    const key = index;
    if (!line) { index++; continue; }
    if (line.startsWith("## ")) {
      blocks.push(<h2 key={key} id={`section-${++section}`}>{line.slice(3)}</h2>);
      index++;
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        const cells = lines[index++].trim().slice(1, -1).split("|").map((cell) => cell.trim());
        if (!cells.every((cell) => /^:?-+:?$/.test(cell))) rows.push(cells);
      }
      blocks.push(<div key={key} className="legal-table" role="region" aria-label={`${section}항 상세 표 (좌우 스크롤)`} tabIndex={0}>
        <table><thead><tr>{rows[0].map((cell, i) => <th key={i} scope="col">{inline(cell)}</th>)}</tr></thead>
          <tbody>{rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{inline(cell)}</td>)}</tr>)}</tbody>
        </table>
      </div>);
    } else if (/^(?:- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: ReactNode[] = [];
      const pattern = ordered ? /^\d+\. / : /^- /;
      const start = ordered ? Number(line.match(/^\d+/)![0]) : undefined;
      while (index < lines.length && pattern.test(lines[index].trim())) {
        items.push(<li key={index}>{inline(lines[index++].trim().replace(pattern, ""))}</li>);
      }
      blocks.push(ordered ? <ol key={key} start={start}>{items}</ol> : <ul key={key}>{items}</ul>);
    } else {
      const paragraph: string[] = [];
      while (index < lines.length && lines[index].trim() && !/^(## |\||- |\d+\. )/.test(lines[index].trim())) paragraph.push(lines[index++].trim());
      blocks.push(<p key={key}>{inline(paragraph.join(" "))}</p>);
    }
  }
  return <div className="legal-prose">{blocks}</div>;
}
