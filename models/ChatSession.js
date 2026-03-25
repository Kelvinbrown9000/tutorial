import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['customer', 'admin'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['waiting', 'active', 'closed'], default: 'waiting' },
    messages: [MessageSchema],
    emailSent: { type: Boolean, default: false },
    autoReplySent: { type: Boolean, default: false },
    lastCustomerMessageAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.ChatSession ||
  mongoose.model('ChatSession', ChatSessionSchema);
