import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountType: {
    type: String,
    enum: ['Checking', 'Savings', 'FixedDeposit'],
    required: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  openedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Account', accountSchema);
