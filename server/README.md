
## Features

- **User Registration**: Register a new user with email, password, and optional profile details.
- **User Login**: Allows users to log in with their email and password, returns a JWT token for authentication.
- **Password Reset**: Users can request a password reset via a one-time OTP sent to their email.
- **Resend OTP**: Resends an OTP for password reset if the previous one has expired.

## API Endpoints

### 1. **POST /register**
Registers a new user.

### 2. **POST /login**
Logs in an existing user.

### 3. **POST /otp-generate**
Generates an OTP for resetting the user’s password.

### 4. **POST /reset-password**
Resets the user's password using a valid OTP.

### 5. **POST /resend-otp**
Resends a new OTP for password reset if the existing one is expired.

## Models

- **User**: Represents the users of the platform, with fields like `email`, `password`, `name`, etc.
- **PasswordReset**: Stores OTPs for password reset functionality.

## Technologies Used

- **Express.js**: Web framework for routing and handling requests.
- **Prisma**: ORM for database interaction.
- **Bcryptjs**: Password hashing and verification.
- **JWT**: Authentication with JSON Web Tokens.
- **Nodemailer**: Sends OTP emails using Gmail SMTP.

## Setup

1. Clone the repository.
2. Set up environment variables (`JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, etc.).
3. Run migrations to set up the database schema with Prisma.
