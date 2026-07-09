import { randomUUID } from "crypto";
import { EventEmitter } from "events";
import type { Job } from "./types";

/**
 * Async job manager with 202 Accepted pattern.
 * TTL 1 hour, cleanup every 5 minutes.
 * Extracted from MaterialView-Pro JobManager.
 */
export class JobManager<T = unknown> extends EventEmitter {
  private jobs = new Map<string, Job<T>>();
  private cacheKeyIndex = new Map<string, Set<string>>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  static TTL_MS = 3_600_000;
  static CLEANUP_INTERVAL_MS = 300_000;

  start(): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(
      () => this.cleanup(),
      JobManager.CLEANUP_INTERVAL_MS,
    );
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  createJob(clientId: string, cacheKey: string, webhookUrl?: string): Job<T> {
    const jobId = randomUUID();
    const job: Job<T> = {
      id: jobId,
      clientId,
      cacheKey,
      webhookUrl,
      status: "pending",
      progress: 0,
      createdAt: Date.now(),
      result: null,
      error: null,
    };
    this.jobs.set(jobId, job);
    if (!this.cacheKeyIndex.has(cacheKey)) {
      this.cacheKeyIndex.set(cacheKey, new Set());
    }
    this.cacheKeyIndex.get(cacheKey)!.add(jobId);
    return job;
  }

  getJob(jobId: string): Job<T> | null {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    if (Date.now() - job.createdAt > JobManager.TTL_MS) {
      this.removeJob(jobId, job);
      return null;
    }
    return job;
  }

  updateJob(jobId: string, updates: Partial<Job<T>>): boolean {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    Object.assign(job, updates);
    return true;
  }

  findActiveJobByCacheKey(cacheKey: string): Job<T> | null {
    const jobIds = this.cacheKeyIndex.get(cacheKey);
    if (!jobIds) return null;
    for (const jobId of jobIds) {
      const job = this.jobs.get(jobId);
      if (job && (job.status === "pending" || job.status === "processing")) {
        return job;
      }
    }
    return null;
  }

  findCompletedJobByCacheKey(cacheKey: string): Job<T> | null {
    const jobIds = this.cacheKeyIndex.get(cacheKey);
    if (!jobIds) return null;
    for (const jobId of jobIds) {
      const job = this.jobs.get(jobId);
      if (job && job.status === "completed") {
        if (Date.now() - job.createdAt <= JobManager.TTL_MS) {
          return job;
        }
      }
    }
    return null;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [jobId, job] of this.jobs.entries()) {
      if (now - job.createdAt > JobManager.TTL_MS) {
        if (job.status === "processing") {
          job.status = "failed";
          job.error = "Job expired during processing";
          this.emit("jobExpired", job);
        }
        this.removeJob(jobId, job);
      }
    }
  }

  private removeJob(jobId: string, job: Job<T>): void {
    this.jobs.delete(jobId);
    const cacheKeySet = this.cacheKeyIndex.get(job.cacheKey);
    if (cacheKeySet) {
      cacheKeySet.delete(jobId);
      if (cacheKeySet.size === 0) {
        this.cacheKeyIndex.delete(job.cacheKey);
      }
    }
  }

  get size(): number {
    return this.jobs.size;
  }

  clear(): void {
    this.jobs.clear();
    this.cacheKeyIndex.clear();
  }
}
