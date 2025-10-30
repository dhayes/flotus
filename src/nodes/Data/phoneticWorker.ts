// phoneticWorker.ts
import { bmpmSimilarity, ExtendedBMPMConfig as cfg } from "bmpm-phonetics";

interface WorkerRequest {
  columnValues: string[];
  targetName: string;
}

function normalize(s: string): string {
  return s
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\s'-]/gu, "")
    .toLowerCase();
}

function fullNameSimilarity(a: string, b: string): number {
  const partsA = normalize(a).split(/\s+/).filter(Boolean);
  const partsB = normalize(b).split(/\s+/).filter(Boolean);
  if (partsA.length === 0 || partsB.length === 0) return 0;

  const len = Math.max(partsA.length, partsB.length);
  const scores: number[] = [];

  for (const partA of partsA) {
    let best = 0;
    for (const partB of partsB) {
      const sim = bmpmSimilarity(partA, partB, cfg);
      if (sim > best) best = sim;
    }
    scores.push(best);
  }

  return scores.reduce((a, b) => a + b, 0) / len;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  console.log("[BMPM Worker] Ready");
  const { columnValues, targetName } = e.data;
  const cache = new Map<string, number>();
  const normalizedTarget = normalize(targetName);

  const scores = columnValues.map((v) => {
    if (typeof v !== "string") return NaN;
    const key = v + "‖" + targetName;
    if (cache.has(key)) return cache.get(key)!;

    const score = fullNameSimilarity(v, normalizedTarget);
    cache.set(key, score);
    return score;
  });

  // Send results back to main thread
  (self as unknown as Worker).postMessage(scores);
};
