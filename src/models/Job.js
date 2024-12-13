import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    required: true
  },
  experience: {
    min: Number,
    max: Number,
    required: String
  },
  education: {
    level: String,
    field: String,
    required: Boolean
  },
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: String,
    isNegotiable: Boolean
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    required: Boolean
  }],
  benefits: [String],
  deadline: Date,
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: Date
}, {
  timestamps: true
});

// Compound indexes for efficient querying
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ skills: 1, status: 1 });
jobSchema.index({ location: 1, status: 1 });
// Text index for search
jobSchema.index({ title: 'text', description: 'text' });

export const Job = mongoose.model('Job', jobSchema);