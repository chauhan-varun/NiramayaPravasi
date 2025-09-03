import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    match: [/^\+?[1-9]\d{9,14}$/, 'Please provide a valid phone number']
  },
  passwordHash: {
    type: String
  },
  role: {
    type: String,
    default: 'patient'
  },
  // For OTP login
  otpSecret: String,
  otpExpires: Date,
  // Additional patient fields could be added here (name, medical history, etc.)
}, {
  timestamps: true
});

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
