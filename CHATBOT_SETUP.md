# Ayurveda Chatbot Integration - Complete Setup Guide

## Overview
Your Ayurveda chatbot has been successfully integrated into your existing health clinic project. The chatbot uses Google's Gemini AI to answer questions about Ayurveda, herbs, treatments, and wellness practices.

## Architecture
- **Frontend**: React component integrated into patient dashboard
- **Backend**: Node.js Express server that proxies requests to Python Flask API
- **AI Service**: Python Flask API using Google Gemini AI
- **Database**: Existing MongoDB (unchanged)

## Setup Instructions

### 1. Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB running
- Google AI Studio API key

### 2. Get Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for later use

### 3. Backend Setup (Node.js)

#### Install new dependencies:
```bash
cd server
npm install
```

The `axios` dependency has already been added to `package.json`.

#### Update environment variables:
Make sure your Node.js server has the necessary environment variables. The `.env` file in the server directory should contain:
```
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 4. Python Chatbot API Setup

#### Create Python virtual environment:
```bash
cd server
python -m venv chatbot_env

# Activate virtual environment
# On macOS/Linux:
source chatbot_env/bin/activate
# On Windows:
# chatbot_env\Scripts\activate
```

#### Install Python dependencies:
```bash
pip install -r requirements.txt
```

#### Configure environment variables:
Update the `.env` file in the server directory with your Google API key:
```
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 5. Frontend Setup (React)

#### Install dependencies (if not already done):
```bash
cd client
npm install
```

No additional dependencies are needed for the frontend as `axios` is already included.

## Running the Application

### Method 1: Run All Services Manually (Recommended for Development)

#### Terminal 1 - MongoDB:
```bash
mongod
```

#### Terminal 2 - Python Chatbot API:
```bash
cd server
source chatbot_env/bin/activate  # Activate virtual environment
python ayurveda_chatbot_api.py
```
This will start the Python API on http://localhost:5001

#### Terminal 3 - Node.js Backend:
```bash
cd server
npm run dev
```
This will start the Express server on http://localhost:5000

#### Terminal 4 - React Frontend:
```bash
cd client
npm run dev
```
This will start the React app on http://localhost:5173

### Method 2: Using Process Managers (Production-like)

You can use PM2 or similar process managers to run all services:

```bash
# Install PM2 globally
npm install -g pm2

# Start Python API
pm2 start server/ayurveda_chatbot_api.py --name "chatbot-api" --interpreter python

# Start Node.js backend
pm2 start server/server.js --name "backend"

# For React, you'll still need to run manually or build for production
cd client && npm run dev
```

## How to Access the Chatbot

1. Open http://localhost:5173 in your browser
2. Login as a patient (use your existing patient credentials)
3. On the patient dashboard, look for the "Quick Actions" section
4. Click on the "🤖 Ayurveda Chatbot" button
5. A modal will open with the chatbot interface
6. Start asking questions about Ayurveda!

## Testing the Chatbot

Try these sample questions:
- "What are the three doshas in Ayurveda?"
- "How to balance Vata dosha?"
- "What herbs are good for digestion?"
- "Tell me about Panchakarma"
- "What is the best diet for Pitta constitution?"

## Troubleshooting

### Common Issues:

1. **Python API not starting:**
   - Make sure virtual environment is activated
   - Check if Google API key is correctly set in .env file
   - Verify all Python packages are installed

2. **Chatbot returns errors:**
   - Check if Python API is running on port 5001
   - Verify Google API key is valid and has proper permissions
   - Check Node.js server logs for proxy errors

3. **Frontend not connecting:**
   - Ensure Node.js backend is running on port 5000
   - Check browser console for network errors
   - Verify axios requests are going to correct URLs

### Port Configuration:
- React Frontend: http://localhost:5173
- Node.js Backend: http://localhost:5000
- Python Chatbot API: http://localhost:5001
- MongoDB: mongodb://localhost:27017

### Log Files:
- Python API logs: Check terminal running `ayurveda_chatbot_api.py`
- Node.js logs: Check terminal running `npm run dev` in server directory
- React logs: Check browser console and terminal running React dev server

## Features

### Current Features:
- ✅ Integration with patient dashboard
- ✅ Modal-based chat interface
- ✅ Real-time responses using Google Gemini AI
- ✅ Chat history during session
- ✅ Error handling and loading states
- ✅ Responsive design matching your project theme

### Potential Enhancements:
- 🔄 Add chat history persistence
- 🔄 Implement advanced RAG with your Ayurveda documents
- 🔄 Add voice input/output
- 🔄 Multi-language support
- 🔄 Integration with patient health records

## Security Notes

1. **API Keys**: Never commit your Google API key to version control
2. **CORS**: The Python API is configured with CORS for development
3. **Rate Limiting**: Consider adding rate limiting in production
4. **Input Validation**: The API includes basic input validation

## File Structure

```
server/
├── ayurveda_chatbot_api.py     # Python Flask API for chatbot
├── routes/
│   └── ayurvedaChatbotRoutes.js # Node.js proxy route
├── requirements.txt             # Python dependencies
├── .env                        # Environment variables
├── chatbot_env/                # Python virtual environment
└── package.json               # Updated with axios dependency

client/src/pages/patient/
├── AyurvedaChat.jsx           # Chatbot React component
└── dashboard.jsx              # Updated with chatbot integration
```

This setup allows your Ayurveda chatbot to run as a separate service while being seamlessly integrated into your existing health clinic application!