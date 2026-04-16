import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String }, // For OTP this might be empty
  location: { type: String, default: 'Unknown' },
  language: { type: String, enum: ['en', 'hi'], default: 'hi' },
  notificationType: { type: String, enum: ['SMS', 'WhatsApp'], default: 'WhatsApp' },
  thresholdPrice: { type: Number, default: 2200 },
  communityBadge: { type: String, default: 'New Farmer' },
  crops: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
