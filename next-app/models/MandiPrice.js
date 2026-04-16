import mongoose from 'mongoose';

const MandiPriceSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  mandi: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, default: 'Quintal' },
  trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.MandiPrice || mongoose.model('MandiPrice', MandiPriceSchema);
