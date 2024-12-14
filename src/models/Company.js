import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    industry: [String],
    size: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    },
    foundedYear: Number,
    location: {
      address: String,
      city: String,
      country: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    website: String,
    logo: String,
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
    },
    benefits: [String],
    culture: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for location-based queries
companySchema.index({ 'location.coordinates': '2dsphere' });
// Text index for search
companySchema.index({ name: 'text', description: 'text' });

export const Company = mongoose.model('Company', companySchema);
