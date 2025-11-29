# Onboarding Bridge Service - Backend

REST API service that syncs user onboarding data with GoHighLevel (GHL) and Custom App.

## Features

- ✅ Automated contact sync with GoHighLevel API v2
- ✅ User provisioning to Custom App
- ✅ Email and phone validation
- ✅ Duplicate user detection via MySQL database
- ✅ Error handling and fallback mechanisms
- ✅ Structured logging
- ✅ Auto-create database & tables via Prisma
- ✅ Clean separation of concerns

## Prerequisites

- Node.js >= 16.x
- MySQL Server running locally (or accessible)
- GoHighLevel API credentials
- Custom App API endpoint

## Quick Setup (Automated Database Creation)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and update these values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/onboarding_bridge"
GHL_API_KEY=your_actual_ghl_api_key
GHL_LOCATION_ID=your_actual_ghl_location_id
GHL_API_BASE_URL=https://services.leadconnectorhq.com/api
CUSTOM_APP_BASE_URL=https://your-replit-url
FRONTEND_URL=http://localhost:5173
```

**Important:** Update `DATABASE_URL` with your MySQL credentials:
- `root` = your MySQL username
- `password` = your MySQL password
- `3306` = MySQL port (default)
- `onboarding_bridge` = database name (will be auto-created)

### 3. Run Migrations (Auto-creates Database & Tables)

```bash
npm run setup
```

This command will:
1. Create the `onboarding_bridge` database automatically
2. Create all required tables
3. Set up indexes

**That's it!** No need to open MySQL Workbench or run any SQL commands manually.

### 4. Start the Server

#### Development (with auto-reload)
```bash
npm run dev
```

#### Production
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### POST /api/onboard
Main webhook receiver for form submissions.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "tags": ["tag1", "tag2"]
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Onboarding completed successfully",
  "data": {
    "ghlContactId": "contact_123",
    "provisioningStatus": "success",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "ghlContactId": "contact_123"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": ["Invalid email format", "Phone must be 10-15 digits"]
}
```

### GET /api/health
Health check endpoint.

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Database Management

### View/Edit Data (Prisma Studio GUI)
```bash
npm run prisma:studio
```

Opens: `http://localhost:5555`

### Reset Database (⚠️ Clears all data)
```bash
npm run prisma:reset
```

Then re-run migrations:
```bash
npm run setup
```

### View Database Schema
Check `prisma/schema.prisma`

## Troubleshooting

### ❌ "MySQL connection refused"

**Problem:** Cannot connect to MySQL server.

**Solution:**
1. Ensure MySQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify MySQL username/password
4. On Windows: Check MySQL Service is running in Services app

```bash
# Windows: Restart MySQL
net stop MySQL80
net start MySQL80

# Or use MySQL Workbench to check connection
```

### ❌ "Table doesn't exist"

**Problem:** Database created but tables missing.

**Solution:** Run migrations again:
```bash
npm run setup
```

Or reset everything:
```bash
npm run prisma:reset
npm run setup
```

### ❌ "Access denied for user 'root'@'localhost'"

**Problem:** Wrong MySQL credentials.

**Solution:** Update `.env`:
```env
DATABASE_URL="mysql://your_username:your_password@localhost:3306/onboarding_bridge"
```

### ❌ "Database 'onboarding_bridge' doesn't exist"

**Problem:** Database wasn't created.

**Solution:** 
```bash
npm run setup
```

This automatically creates the database and tables.

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (interactive)
npm run prisma:migrate

# Open database GUI
npm run prisma:studio

# Reset database (clears all data!)
npm run prisma:reset
```

## Project Structure

