/**
 * MongoDB-based Lightweight Job Queue for heavy SEO tasks
 * Replaces Redis/Bull — uses existing MongoDB connection
 */

import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';
import type { JobType, JobStatus, SeoJobPayload, SeoJobResult } from './types';

interface JobDocument {
  _id: string;
  type: JobType;
  input: unknown;
  status: JobStatus;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  result: Record<string, unknown> | null;
  error: string | null;
}

const JOB_COLLECTION = 'seo_jobs';

export async function enqueueJob(payload: SeoJobPayload): Promise<string> {
  const db = await getDb();
  const jobId = crypto.randomUUID();
  await db.collection<JobDocument>(JOB_COLLECTION).insertOne({
    _id: jobId,
    type: payload.type,
    input: payload.input,
    status: 'pending' as JobStatus,
    createdAt: new Date(),
    startedAt: null,
    completedAt: null,
    result: null,
    error: null,
  });
  return jobId;
}

export async function getJob(jobId: string): Promise<SeoJobResult | null> {
  const db = await getDb();
  const doc = await db.collection<JobDocument>(JOB_COLLECTION).findOne({ _id: jobId });
  if (!doc) return null;
  return {
    jobId: doc._id,
    type: doc.type,
    status: doc.status,
    result: doc.result ?? undefined,
    error: doc.error ?? undefined,
    startedAt: doc.startedAt ?? undefined,
    completedAt: doc.completedAt ?? undefined,
  };
}

export async function updateJobStatus(
  jobId: string,
  status: JobStatus,
  result?: Record<string, unknown>,
  error?: string,
): Promise<void> {
  const db = await getDb();
  const update: Record<string, unknown> = { status };
  if (status === 'running') update.startedAt = new Date();
  if (status === 'completed' || status === 'failed') update.completedAt = new Date();
  if (result) update.result = result;
  if (error) update.error = error;
  await db.collection<JobDocument>(JOB_COLLECTION).updateOne({ _id: jobId }, { $set: update });
}

export async function listJobs(type?: JobType, limit = 20): Promise<SeoJobResult[]> {
  const db = await getDb();
  const filter = type ? { type } : {};
  const docs = await db.collection<JobDocument>(JOB_COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(doc => ({
    jobId: doc._id,
    type: doc.type,
    status: doc.status,
    result: doc.result ?? undefined,
    error: doc.error ?? undefined,
    startedAt: doc.startedAt ?? undefined,
    completedAt: doc.completedAt ?? undefined,
  }));
}

async function getDb() {
  await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error('[SEO Queue] MongoDB not connected');
  return db;
}
