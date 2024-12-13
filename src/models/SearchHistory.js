import mongoose from 'mongoose';

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  query: {
    type: String,
    required: true
  },
  filters: {
    location: String,
    skills: [String],
    experience: String,
    salary: {
      min: Number,
      max: Number
    },
    jobType: [String],
    company: String
  },
  results: {
    count: Number,
    relevance: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for user's recent searches
searchHistorySchema.index({ user: 1, createdAt: -1 });

export const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);