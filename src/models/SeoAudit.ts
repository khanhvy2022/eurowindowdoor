import mongoose, { Schema } from 'mongoose';

const SeoAuditSchema = new Schema({
  url:        { type: String, required: true, index: true },
  score:      { type: Number, required: true },
  issues:     [Schema.Types.Mixed],
  checklist:  [Schema.Types.Mixed],
  pageData:   Schema.Types.Mixed,
  auditedAt:  { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const SeoAudit = mongoose.models.SeoAudit
  || mongoose.model('SeoAudit', SeoAuditSchema);
