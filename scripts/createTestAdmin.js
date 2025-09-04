// This script creates a test Admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define SuperAdmin and Admin schemas
const SuperAdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'superadmin'
  }
});

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
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
});

// Create the interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createTestAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get SuperAdmin and Admin models
    const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);
    const Admin = mongoose.models.Admin || mongoose.model('AdminSchema', AdminSchema);

    // Find any super admin to use as createdBy
    const superAdmin = await SuperAdmin.findOne({});
    if (!superAdmin) {
      console.error('No SuperAdmin found. Please create a SuperAdmin first.');
      process.exit(1);
    }

    // Admin email and password
    const email = 'admin@test.com';
    const password = 'admin123';

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the admin
    const admin = new Admin({
      email,
      passwordHash,
      role: 'admin', // Explicitly set role to 'admin'
      createdBy: superAdmin._id
    });

    // Save the admin
    await admin.save();
    console.log(`Test Admin created successfully with email: ${email} and password: ${password}`);
    console.log(`Role explicitly set to: 'admin'`);
    console.log(`Created by SuperAdmin: ${superAdmin.email}`);

    // Close MongoDB connection
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('Error creating test admin:', error);
    process.exit(1);
  }
}

createTestAdmin();
