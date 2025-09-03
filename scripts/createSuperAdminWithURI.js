// This script creates a Super Admin user with provided email
// IMPORTANT: Delete this file after running it to create the initial Super Admin

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Get MongoDB URI from user
rl.question('Enter your MongoDB URI (e.g. mongodb+srv://...): ', async (mongodbUri) => {
  try {
    // Set email for super admin
    const email = 'varunrajput6988@gmail.com';

    console.log(`Trying to connect to MongoDB at: ${mongodbUri.substring(0, 20)}...`);
    
    // Connect to MongoDB
    await mongoose.connect(mongodbUri);
    console.log('Connected to MongoDB');

    // Get SuperAdmin model
    const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);

    // Check if a Super Admin with this email already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ email });
    if (existingSuperAdmin) {
      console.log(`A Super Admin with email ${email} already exists in the database`);
      rl.close();
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

    console.log(`\nSuper Admin created successfully!`);
    console.log(`------------------------------`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nIMPORTANT: Save this password and delete this script file now for security!`);
    
    rl.close();
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating Super Admin:', error);
    rl.close();
    mongoose.disconnect();
  }
});
