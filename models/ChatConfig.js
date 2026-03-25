import mongoose from 'mongoose';

// Singleton document — key: 'admin_status'
const ChatConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },
});

export default mongoose.models.ChatConfig ||
  mongoose.model('ChatConfig', ChatConfigSchema);
