# 🚀 Onboarding Bridge Service

Complete end-to-end automated onboarding system that syncs user data with GoHighLevel (GHL) and a Custom Application.

## 📋 Overview

This project provides:
1. **REST API** - Receives user registration forms
2. **GHL Integration** - Syncs contacts with GoHighLevel API v2
3. **Custom App Sync** - Provisions users in external application
4. **MySQL Database** - Stores user records and prevents duplicates
5. **React Frontend** - Beautiful registration form with validation

## 🏗️ Architecture

```
onboarding-bridge-service/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Auth & validation
│   │   ├── services/       # GHL & external integrations
│   │   └── config/         # Configuration files
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client services
│   │   ├── hooks/          # Custom React hooks
│   │   └── App.js
│   └── package.json
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: MySQL
- **External APIs**: GoHighLevel API v2
- **Authentication**: JWT/API Keys

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=onboarding_db

GHL_API_KEY=your_ghl_api_key
GHL_API_URL=https://api.gohighlevel.com/v2

CUSTOM_APP_API_URL=your_custom_app_url
CUSTOM_APP_API_KEY=your_custom_app_key

JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 API Endpoints

### User Registration
- `POST /api/users/register` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `GET /api/users` - List all users

### GHL Integration
- `POST /api/ghl/sync` - Sync contact to GoHighLevel
- `GET /api/ghl/status` - Check sync status

### Health Check
- `GET /api/health` - API health status

## 📊 Database Schema

Key tables:
- `users` - User registration data
- `sync_logs` - GHL sync history
- `app_provisions` - Custom app provisioning records

## 🔐 Security Features

- Input validation on all endpoints
- SQL injection prevention via prepared statements
- JWT authentication for protected routes
- Environment variable management
- CORS configuration
- Rate limiting

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 Git Guidelines

Ensure `node_modules/` is in `.gitignore` for both frontend and backend:
```
node_modules/
frontend/node_modules/
backend/node_modules/
```

## 🚢 Deployment

### Docker Support (Optional)
```bash
docker-compose up
```

### Production Build
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 📞 Support & Documentation

For issues or questions, refer to individual component documentation or create an issue in the repository.

## 📄 License

[Your License Here]

