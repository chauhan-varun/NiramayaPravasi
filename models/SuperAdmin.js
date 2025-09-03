import mongoose from 'mongoose';

const SuperAdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password']
  },
  role: {
    type: String,
    default: 'superadmin'
  },
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String
}, {
  timestamps: true
});

export default mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);
