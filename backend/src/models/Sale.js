const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true
  },
  customerId: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  age: {
    type: Number,
    required: true
  },
  productCategory: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  customerRegion: {
    type: String,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  tags: {
    type: String
  },
  paymentMethod: {
    type: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
salesSchema.index({ customerName: 'text', phoneNumber: 'text' });
salesSchema.index({ date: -1 });
salesSchema.index({ customerRegion: 1 });
salesSchema.index({ gender: 1 });
salesSchema.index({ productCategory: 1 });
salesSchema.index({ paymentMethod: 1 });
salesSchema.index({ tags: 1 });

module.exports = mongoose.model('Sale', salesSchema);
