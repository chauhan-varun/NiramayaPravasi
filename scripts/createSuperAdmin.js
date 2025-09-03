// This script creates a Super Admin user
// IMPORTANT: Delete this file after running it to create the initial Super Admin

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

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

// Create the interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Get SuperAdmin model
    const SuperAdmin = mongoose.models.SuperAdmin || mongoose.model('SuperAdmin', SuperAdminSchema);

    // Check if a Super Admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      console.log('A Super Admin already exists in the database');
      process.exit(0);
    }

    // Prompt for email and password
    rl.question('Enter Super Admin email: ', (email) => {
      if (!email.match(/^\S+@\S+\.\S+$/)) {
        console.error('Invalid email format');
        rl.close();
        process.exit(1);
      }

      rl.question('Enter Super Admin password: ', async (password) => {
        if (password.length < 8) {
          console.error('Password must be at least 8 characters');
          rl.close();
          process.exit(1);
        }

        try {
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
          console.log('IMPORTANT: Delete this script file now for security!');
          
          rl.close();
          process.exit(0);
        } catch (error) {
          console.error('Error creating Super Admin:', error);
          rl.close();
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

// Run the function
createSuperAdmin();
