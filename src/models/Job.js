import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    // ... other fields ...
    salary: {
      text: String,
      min: Number,
      max: Number,
      currency: { type: String, default: 'KRW' },
      isNegotiable: { type: Boolean, default: true },
    },
    // ... other fields ...
  },
  {
    timestamps: true,
  }
);

// ... rest of the schema ...