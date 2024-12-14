import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      default: 'full-time',
    },
    experience: {
      required: String,
      min: { type: Number, default: 0 },
      max: { type: Number, default: 99 },
    },
    education: {
      level: String,
      field: String,
      required: { type: Boolean, default: false },
    },
    salary: {
      text: String,
      min: Number,
      max: Number,
      currency: { type: String, default: 'KRW' },
      isNegotiable: { type: Boolean, default: true },
    },
    skills: [
      {
        name: { type: String, required: true },
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
          default: 'intermediate',
        },
        required: { type: Boolean, default: true },
      },
    ],
    deadline: Date,
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ skills: 1, status: 1 });
jobSchema.index({ location: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text' });

// Methods
jobSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Statics
jobSchema.statics.findActive = function () {
  return this.find({ status: 'active' });
};

jobSchema.statics.exists = async function (link) {
  const count = await this.countDocuments({ link });
  return count > 0;
};

export const Job = mongoose.model('Job', jobSchema);
