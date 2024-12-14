import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      'application_status',
      'job_alert',
      'interview_scheduled',
      'reminder',
      'system',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  reference: {
    model: {
      type: String,
      enum: ['Job', 'Application', 'Interview', 'Company'],
    },
    id: mongoose.Schema.Types.ObjectId,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: Date,
});

// Compound indexes for efficient querying
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', notificationSchema);
