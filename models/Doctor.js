import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
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
    enum: ['pending_doctor', 'doctor'],
    default: 'pending_doctor'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Additional doctor fields could be added here (name, specialization, etc.)
}, {
  timestamps: true
});

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
