import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
      default: 'pending',
    },
    resume: {
      url: String,
      version: Number,
    },
    coverLetter: String,
    answers: [
      {
        question: String,
        answer: String,
      },
    ],
    notes: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interviews: [
      {
        type: {
          type: String,
          enum: ['phone', 'video', 'onsite'],
        },
        scheduledAt: Date,
        duration: Number,
        location: String,
        notes: String,
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'cancelled'],
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound indexes
applicationSchema.index({ job: 1, user: 1 }, { unique: true });
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
