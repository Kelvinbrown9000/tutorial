import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    phone: { type: String, trim: true },
    memberNumber: { type: String, unique: true },
    membershipType: { type: String, enum: ['personal', 'business'], default: 'personal' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
  },
  { timestamps: true }
);

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre('save', async function (next) {
  if (!this.memberNumber) {
    this.memberNumber = await User.generateMemberNumber();
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.statics.generateMemberNumber = async function () {
  let memberNumber;
  let exists = true;
  while (exists) {
    const digits = Math.floor(10000000 + Math.random() * 90000000);
    memberNumber = `GT${digits}`;
    exists = await mongoose.models.User?.findOne({ memberNumber });
  }
  return memberNumber;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
