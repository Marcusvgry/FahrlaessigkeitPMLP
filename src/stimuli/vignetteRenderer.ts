// src/experiment/stimuli/vignetteRenderer.ts
import type { Condition } from "../experiment/conditions";

export type Segment =
  | { kind: "base"; text: string }
  | { kind: "offload_yes"; text: string }
  | { kind: "offload_no"; text: string }
  | { kind: "cons_low"; text: string }
  | { kind: "cons_high"; text: string };

export type VignetteTemplate = {
  id: number;
  domain: string;
  variants?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  segments?: Segment[];
};

export function renderVignetteText(
  v: VignetteTemplate,
  cond: Condition,
): string {
  if (v.variants) {
    const key =
      cond.offloading === "yes"
        ? cond.consequences === "low"
          ? "A"
          : "B"
        : cond.consequences === "low"
          ? "C"
          : "D";

    const text = v.variants[key];
    // Absätze/Whitespace zu Fließtext normalisieren
    return text.replace(/\s+/g, " ").trim();
  }

  const segments = v.segments ?? [];
  const text = segments
    .filter((s) => {
      if (s.kind === "base") return true;
      if (s.kind === "offload_yes") return cond.offloading === "yes";
      if (s.kind === "offload_no") return cond.offloading === "no";
      if (s.kind === "cons_low") return cond.consequences === "low";
      if (s.kind === "cons_high") return cond.consequences === "high";
      return false;
    })
    .map((s) => s.text)
    .join("");

  return text.replace(/\s+/g, " ").trim();
}

export function wrapStimulusHtml(text: string): string {
  return `
    <div style="max-width: 900px; margin: 0 auto; text-align: left; line-height: 1.55;">
      <p>${text}</p>
    </div>
  `;
}
