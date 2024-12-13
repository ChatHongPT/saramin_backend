import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['programming', 'framework', 'database', 'tool', 'soft-skill', 'other']
  },
  description: String,
  aliases: [String],
  popularity: {
    type: Number,
    default: 0
  },
  relatedSkills: [{
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    relationship: {
      type: String,
      enum: ['prerequisite', 'similar', 'complementary']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
}, {
  timestamps: true
});

// Text index for search
skillSchema.index({ name: 'text', description: 'text' });
// Index for category-based queries
skillSchema.index({ category: 1, popularity: -1 });

export const Skill = mongoose.model('Skill', skillSchema);