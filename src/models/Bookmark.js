import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
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
  notes: String,
  tags: [String],
  reminderDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, job: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);