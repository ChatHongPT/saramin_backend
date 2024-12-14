import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['job', 'application', 'system'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Notification = mongoose.model('Notification', notificationSchema);