# Onboarding Bridge Service - Frontend

React + Vite application for user registration with real-time validation and feedback.

## Features

- ✅ Clean, responsive registration form
- ✅ Real-time email and phone validation
- ✅ Loading spinner during submission
- ✅ Success/error toast notifications
- ✅ API health check on load
- ✅ Client-side form validation

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Application opens at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## Environment Variables

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

- Ensure backend is running on `http://localhost:5000`
- Check browser console for detailed error logs

