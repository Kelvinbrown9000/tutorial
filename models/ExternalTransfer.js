import mongoose from 'mongoose';

const externalTransferSchema = new mongoose.Schema(
  {
    referenceId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    recipientName: { type: String, required: true, maxlength: 200 },
    recipientBank: { type: String, maxlength: 200 },
    routingNumber: { type: String, required: true, match: /^\d{9}$/ },
    recipientAccountNumber: { type: String, required: true, maxlength: 50 },
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'contact_support'],
      default: 'pending',
      index: true,
    },
    adminNote: { type: String, maxlength: 1000 },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    processedAt: { type: Date },
    resultTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  },
  { timestamps: true }
);

externalTransferSchema.pre('save', function (next) {
  if (!this.referenceId) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referenceId = `EXT${ts}${rand}`;
  }
  next();
});

const ExternalTransfer =
  mongoose.models.ExternalTransfer ||
  mongoose.model('ExternalTransfer', externalTransferSchema);

export default ExternalTransfer;
