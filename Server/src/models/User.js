import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    length: 10,
  },
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  isLocked: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
