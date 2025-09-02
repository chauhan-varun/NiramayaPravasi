# Nirmaya Pravasi - Patient Record Management System

A comprehensive healthcare management platform built with Next.js 15, featuring multi-role authentication, SMS OTP verification, and secure patient record management.

## 🚀 Features

### Authentication System
- **Multi-role authentication** with different login methods for each user type
- **SMS OTP verification** using Twilio for doctors and patients
- **Email + Password login** for admins and super admins
- **Google OAuth integration** for administrators
- **Role-based access control** with secure JWT tokens
- **MFA support** (planned) for enhanced security

### User Roles

#### 1. Super Admin
- **Creation**: Manual database entry (one per system)
- **Login**: Email + Password
- **Access**: Full system control, admin management
- **Features**: Create/manage admins, system oversight

#### 2. Admin
- **Creation**: Created by Super Admin only
- **Login**: Email + Password or Google OAuth
- **Access**: Doctor approval, user management
- **Features**: Approve/reject doctors, manage system users

#### 3. Doctor
- **Registration**: Phone + OTP (requires admin approval)
- **Login**: Phone + OTP
- **Status**: Pending → Approved by Admin
- **Features**: Patient record management, prescriptions

#### 4. Patient
- **Registration**: Phone + OTP or Phone + Password
- **Login**: Phone + OTP or Phone + Password
- **Access**: Immediate after registration
- **Features**: View medical records, book appointments

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Prisma ORM
- **SMS Service**: Twilio
- **Security**: bcryptjs, JWT, speakeasy (MFA)

## 📋 Prerequisites

- Node.js 18+ and pnpm
- MongoDB database
- Twilio account for SMS
- Google OAuth credentials (optional)

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd nirmaya-pravasi
pnpm install
```

### 2. Environment Configuration
Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/nirmaya-pravasi"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Twilio (Required for SMS OTP)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="your-twilio-phone-number"

# JWT Secret
JWT_SECRET="your-jwt-secret-here"

# Super Admin Credentials
SUPER_ADMIN_EMAIL="root@system.com"
SUPER_ADMIN_PASSWORD="SuperAdmin@123"
```

### 3. Database Setup
```bash
# Generate Prisma client
pnpm run db:generate

# Push schema to database
pnpm run db:push

# Create super admin
pnpm run setup:super-admin
```

### 4. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` to access the application.

## 🔐 Authentication Flow

### For Patients & Doctors (Phone-based)
1. Enter phone number
2. Receive SMS OTP via Twilio
3. Verify OTP
4. For doctors: Wait for admin approval
5. Login with phone + OTP

### For Admins (Email-based)
1. Login with email + password
2. Or use Google OAuth
3. Access admin dashboard

### For Super Admin
1. Use credentials set in environment
2. Full system access
3. Can create new admins

## 📱 API Endpoints

### Authentication
- `POST /api/auth/otp/send` - Send OTP to phone
- `POST /api/auth/otp/verify` - Verify OTP
- `POST /api/auth/register/doctor` - Doctor registration
- `POST /api/auth/register/patient` - Patient registration

### Admin Management
- `GET /api/admin/admins` - List all admins (Super Admin only)
- `POST /api/admin/admins` - Create new admin (Super Admin only)
- `GET /api/admin/doctors` - Get pending doctors
- `POST /api/admin/doctors` - Approve/reject doctors

## 🏗️ Project Structure

```
app/
├── (public)/
│   ├── admin/           # Admin dashboard
│   │   └── super/       # Super admin dashboard
│   ├── doctor/          # Doctor dashboard  
│   └── (patient)/
│       └── patient/     # Patient dashboard
├── api/
│   ├── auth/           # Authentication endpoints
│   └── admin/          # Admin management endpoints
├── auth/
│   ├── signin/         # Sign in page
│   └── register/       # Registration page
components/
├── ui/                 # shadcn/ui components
└── auth-provider.jsx   # NextAuth session provider
lib/
├── prisma.js          # Database connection
├── auth.js            # Auth utilities
├── auth-config.js     # NextAuth configuration
└── twilio.js          # SMS/OTP utilities
prisma/
└── schema.prisma      # Database schema
scripts/
└── create-super-admin.js  # Super admin creation script
```

## 🔒 Security Features

- **Encrypted passwords** using bcryptjs
- **JWT tokens** with expiration
- **OTP verification** with attempt limits
- **Role-based access control**
- **Input validation** and sanitization
- **Rate limiting** on OTP requests
- **Secure session management**

## 🚦 Getting Started - First Login

1. **Super Admin**: Use credentials from `.env.local`
   - Email: `root@system.com`
   - Password: `SuperAdmin@123`

2. **Create Admin**: Login as Super Admin → Admin Management → Create Admin

3. **Doctor Registration**: Register → Doctor → Complete approval process

4. **Patient Registration**: Register → Patient → Immediate access

## 📋 Development Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm run db:generate        # Generate Prisma client
pnpm run db:push           # Push schema changes
pnpm run db:studio         # Open Prisma Studio

# Setup
pnpm run setup:super-admin  # Create super admin
```

## 🔧 Troubleshooting

### Common Issues

1. **OTP not received**: Check Twilio credentials and phone number format
2. **Database connection**: Verify MongoDB is running and URL is correct
3. **Google OAuth**: Ensure redirect URLs are configured correctly
4. **Super Admin creation**: Run setup script after database is ready

### Phone Number Format
- Indian numbers: `+919876543210` or `9876543210`
- International: Include country code with `+`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

Built with ❤️ using Next.js 15, Prisma, and Twilio
