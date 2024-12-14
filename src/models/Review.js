import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    workLifeBalance: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    compensation: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    culture: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  pros: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  cons: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// 사용자당 회사/채용공고 하나에 대해 하나의 리뷰만 작성 가능
reviewSchema.index({ user: 1, job: 1 }, { unique: true });
reviewSchema.index({ company: 1, status: 1 });

export const Review = mongoose.model('Review', reviewSchema);