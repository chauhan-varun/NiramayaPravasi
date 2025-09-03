// This script creates a Super Admin user with provided email
// IMPORTANT: Delete this file after running it to create the initial Super Admin

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Email to use for Super Admin
const email = 'varunrajput6988@gmail.com';

// Default MongoDB URI - modify if needed
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nirmaya-pravasi';

// Define SuperAdmin schema locally to avoid requiring the model file
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

async function createSuperAdmin() {
  try {
    console.log(`Trying to connect to MongoDB at: ${MONGODB_URI}`);
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get SuperAdmin model
    const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);

    // Check if a Super Admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('A Super Admin already exists in the database');
      mongoose.disconnect();
      return;
    }

    // Generate a strong random password
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).toUpperCase().slice(-2) + '!';
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Super Admin
    const superAdmin = await SuperAdmin.create({
      email,
      passwordHash,
      role: 'superadmin',
      mfaEnabled: false
    });

    console.log(`Super Admin created with email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('IMPORTANT: Save this password and delete this script file now for security!');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating Super Admin:', error);
    mongoose.disconnect();
  }
}

// Run the function
createSuperAdmin();