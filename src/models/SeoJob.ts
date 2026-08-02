import mongoose, { Schema } from 'mongoose';

const SeoJobSchema = new Schema({
  _id:         { type: String },
  type:        { type: String, required: true, index: true },
  input:       Schema.Types.Mixed,
  status:      { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending', index: true },
  result:      Schema.Types.Mixed,
  error:       String,
  startedAt:   Date,
  completedAt: Date,
}, { timestamps: true });

export const SeoJob = mongoose.models.SeoJob
  || mongoose.model('SeoJob', SeoJobSchema);
