import mongoose, { Schema } from 'mongoose';

const SeoKeywordSchema = new Schema({
  seed:        { type: String, required: true, index: true },
  domain:      { type: String, default: 'eurowindow.com.vn' },
  clusters:    [Schema.Types.Mixed],
  questions:   [Schema.Types.Mixed],
  gaps:        [Schema.Types.Mixed],
  researchedAt:{ type: Date, default: Date.now },
}, { timestamps: true });

export const SeoKeyword = mongoose.models.SeoKeyword
  || mongoose.model('SeoKeyword', SeoKeywordSchema);
