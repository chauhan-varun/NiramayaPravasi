import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
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
    default: 'admin'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
