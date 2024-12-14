import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      basicInfo: {
        name: String,
        email: String,
        phone: String,
        address: String,
      },
      education: [
        {
          school: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
        },
      ],
      experience: [
        {
          company: String,
          position: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      skills: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'active'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

resumeSchema.index({ user: 1, status: 1 });

export const Resume = mongoose.model('Resume', resumeSchema);