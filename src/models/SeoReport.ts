import mongoose, { Schema } from 'mongoose';

const SeoReportSchema = new Schema({
  type:            { type: String, enum: ['weekly', 'monthly', 'quarterly', 'custom'], required: true },
  title:           { type: String, required: true },
  period:          { from: Date, to: Date },
  seoScore:        Schema.Types.Mixed,
  topIssues:       [Schema.Types.Mixed],
  topKeywords:     [Schema.Types.Mixed],
  recommendations: [String],
  generatedAt:     { type: Date, default: Date.now, index: true },
}, { timestamps: true });

export const SeoReport = mongoose.models.SeoReport
  || mongoose.model('SeoReport', SeoReportSchema);
