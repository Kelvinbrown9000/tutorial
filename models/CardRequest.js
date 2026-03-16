import mongoose from 'mongoose';

const cardRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    cardType: { type: String, enum: ['debit', 'credit', 'prepaid'], required: true },
    status: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'denied', 'shipped'],
      default: 'pending',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    adminNotes: { type: String, maxlength: 1000 },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    requestedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CardRequest =
  mongoose.models.CardRequest || mongoose.model('CardRequest', cardRequestSchema);
export default CardRequest;
