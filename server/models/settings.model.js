import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "Connect",
    trim: true
  },
  siteDescription: {
    type: String,
    default: "Connect with your community",
    trim: true
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  defaultUserRole: {
    type: String,
    enum: ['student', 'organizer', 'business'],
    default: 'student'
  },
  maxUploadSize: {
    type: Number,
    default: 5,
    min: 1,
    max: 100
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('Settings', SettingsSchema);
