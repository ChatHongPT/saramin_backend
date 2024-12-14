import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  content: {
    basicInfo: {
      name: String,
      email: String,
      phone: String,
      address: String
    },
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
      description: String
    }],
    experience: [{
      company: String,
      position: String,
      startDate: Date,
      endDate: Date,
      description: String,
      achievements: [String]
    }],
    skills: [{
      category: String,
      items: [String]
    }],
    projects: [{
      name: String,
      description: String,
      startDate: Date,
      endDate: Date,
      technologies: [String],
      role: String,
      achievements: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      description: String
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// 인덱스 설정
resumeSchema.index({ user: 1, status: 1 });
resumeSchema.index({ user: 1, version: 1 });

// 기본 이력서는 하나만 존재하도록 보장
resumeSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

export const Resume = mongoose.model('Resume', resumeSchema);