import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    accountNumber: { type: String, unique: true },
    type: { type: String, enum: ['checking', 'savings'], required: true },
    balance: { type: Number, default: 0, min: 0 },
    availableBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    interestRate: { type: Number, default: 0 },
    nickname: { type: String, maxlength: 50 },
  },
  { timestamps: true }
);

accountSchema.pre('save', async function (next) {
  if (!this.accountNumber) {
    const prefix = this.type === 'checking' ? 'GTCHK' : 'GTSAV';
    let exists = true;
    while (exists) {
      const digits = Math.floor(10000000 + Math.random() * 90000000);
      this.accountNumber = `${prefix}${digits}`;
      exists = await mongoose.models.Account?.findOne({ accountNumber: this.accountNumber });
    }
  }
  if (this.isNew) {
    this.interestRate = this.type === 'savings' ? 0.0475 : 0.0001;
    this.availableBalance = this.balance;
  }
  next();
});

// Keep availableBalance in sync with balance on updates
accountSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update?.$inc?.balance !== undefined) {
    update.$inc.availableBalance = update.$inc.balance;
  }
  if (update?.$set?.balance !== undefined) {
    if (!update.$set) update.$set = {};
    update.$set.availableBalance = update.$set.balance;
  }
  next();
});

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);
export default Account;
