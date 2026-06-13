// Simple offline queue MVP.
// Stocke des "jobs" en localStorage et les re-déclenche au retour réseau.
// Usage : runOrQueue(label, async () => { ... }).

const STORAGE_KEY = "netodash:offline-queue:v1";

type QueuedJob = {
  id: string;
  label: string;
  payload: unknown;
  createdAt: number;
};

type JobRunner = (payload: any) => Promise<void>;

const runners = new Map<string, JobRunner>();

function readQueue(): QueuedJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedJob[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(jobs: QueuedJob[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    window.dispatchEvent(new CustomEvent("offline-queue:change"));
  } catch {
    // ignore
  }
}

export function getQueueSize(): number {
  if (typeof window === "undefined") return 0;
  return readQueue().length;
}

export function subscribeQueue(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener("offline-queue:change", handler);
  window.addEventListener("online", handler);
  window.addEventListener("offline", handler);
  return () => {
    window.removeEventListener("offline-queue:change", handler);
    window.removeEventListener("online", handler);
    window.removeEventListener("offline", handler);
  };
}

export function registerRunner(label: string, fn: JobRunner) {
  runners.set(label, fn);
}

export async function runOrQueue<T>(
  label: string,
  payload: any,
  fn: () => Promise<T>,
): Promise<{ status: "ok"; result: T } | { status: "queued" }> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    queueJob(label, payload);
    return { status: "queued" };
  }
  try {
    const result = await fn();
    return { status: "ok", result };
  } catch (err: any) {
    // Erreur réseau probable
    const msg = String(err?.message ?? err ?? "").toLowerCase();
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("offline")) {
      queueJob(label, payload);
      return { status: "queued" };
    }
    throw err;
  }
}

function queueJob(label: string, payload: unknown) {
  const jobs = readQueue();
  jobs.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    label,
    payload,
    createdAt: Date.now(),
  });
  writeQueue(jobs);
}

export async function flushQueue(): Promise<{ ok: number; fail: number }> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return { ok: 0, fail: 0 };
  }
  const jobs = readQueue();
  if (jobs.length === 0) return { ok: 0, fail: 0 };

  let ok = 0;
  let fail = 0;
  const remaining: QueuedJob[] = [];
  for (const job of jobs) {
    const runner = runners.get(job.label);
    if (!runner) {
      remaining.push(job);
      continue;
    }
    try {
      await runner(job.payload);
      ok++;
    } catch {
      fail++;
      remaining.push(job);
    }
  }
  writeQueue(remaining);
  return { ok, fail };
}

let listenersInitialized = false;
export function initOfflineQueue() {
  if (listenersInitialized || typeof window === "undefined") return;
  listenersInitialized = true;
  window.addEventListener("online", () => {
    flushQueue();
  });
  // Tentative initiale (au cas où des jobs traînent au reload)
  setTimeout(() => flushQueue(), 1500);
}
