import mongoose from 'mongoose';

const creditCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  creditLimit: {
    type: Number,
    required: true
  },
  availableCredit: {
    type: Number,
    required: true
  },
  issuedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CreditCard', creditCardSchema);
