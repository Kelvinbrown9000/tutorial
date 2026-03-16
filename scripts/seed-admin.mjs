import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load .env.local manually (no dotenv dependency needed)
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  if (key) process.env[key] = val;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

await mongoose.connect(MONGODB_URI);

// ── Inline schema (no @/ alias in plain Node) ──────────────────────────
const userSchema = new mongoose.Schema(
  {
    firstName: String, lastName: String,
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    phone: String,
    memberNumber: { type: String, unique: true },
    membershipType: { type: String, default: 'personal' },
    role: { type: String, default: 'user' },
    isActive: { type: Boolean, default: true },
    failedLoginAttempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const accountSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    accountNumber: { type: String, unique: true },
    type: String, balance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    interestRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

// ── Credentials ────────────────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@guardiantrust.com';
const ADMIN_PASSWORD = 'Admin@GT2024';
const ADMIN_MEMBER   = 'GT00000001';

// Remove any existing admin with this email
await User.deleteOne({ email: ADMIN_EMAIL });

const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
const admin  = await User.create({
  firstName: 'Guardian',
  lastName:  'Admin',
  email:     ADMIN_EMAIL,
  password:  hashed,
  memberNumber: ADMIN_MEMBER,
  role: 'admin',
  isActive: true,
});

// Create accounts for admin
const rnd = () => Math.floor(10000000 + Math.random() * 90000000);
await Account.deleteMany({ userId: admin._id });
await Account.create([
  { userId: admin._id, type: 'checking', accountNumber: `GTCHK${rnd()}`, interestRate: 0.0001 },
  { userId: admin._id, type: 'savings',  accountNumber: `GTSAV${rnd()}`, interestRate: 0.0475 },
]);

console.log('\n✅  Admin account created successfully!\n');
console.log('  Email (login):  ', ADMIN_EMAIL);
console.log('  Member number:  ', ADMIN_MEMBER);
console.log('  Password:       ', ADMIN_PASSWORD);
console.log('  Role:           ', 'admin');
console.log('\n  → Sign in at: http://localhost:3000/signin');
console.log('  → Admin panel: http://localhost:3000/admin\n');

await mongoose.disconnect();
