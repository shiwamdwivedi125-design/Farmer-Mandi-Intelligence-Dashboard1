import mongoose from 'mongoose';

const CommunityReportSchema = new mongoose.Schema({
  farmerName: { type: String, required: true },
  mandiLocation: { type: String, required: true },
  crowdLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  notes: { type: String },
  submittedAt: { type: Date, default: Date.now },
});

// Avoid OverwriteModelError in hot-reloading Next.js dev environment
export default mongoose.models.CommunityReport || mongoose.model('CommunityReport', CommunityReportSchema);
