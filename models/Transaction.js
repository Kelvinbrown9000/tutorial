import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer_in', 'transfer_out', 'admin_credit', 'admin_debit'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    balanceAfter: { type: Number },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    description: { type: String, maxlength: 500 },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'reversed'], default: 'completed' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ip: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ accountId: 1, createdAt: -1 });

transactionSchema.pre('save', function (next) {
  if (!this.transactionId) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.transactionId = `TXN${ts}${rand}`;
  }
  next();
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
