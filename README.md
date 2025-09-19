# Ayurveda Health Clinic Management System

A modern, full-stack web application for managing an Ayurveda health clinic with integrated AI-powered chatbot assistance. The system provides separate interfaces for administrators/doctors and patients, with comprehensive patient management, diet chart generation, and an intelligent Ayurveda consultant chatbot.

## 🌟 Features

### 👨‍⚕️ Admin/Doctor Features
- **Patient Management**: Add, view, edit, and delete patient records
- **Ayurvedic Assessment**: Track dominant Prakriti, dosha, lifestyle, and Agni status
- **Diet Chart Generation**: Create personalized diet plans based on Ayurvedic principles
- **Reports & Analytics**: View patient statistics and health reports
- **Settings Management**: Configure clinic settings and preferences
- **Credential Management**: Auto-generate secure patient login credentials

### 👤 Patient Features
- **Secure Login**: Individual patient portals with auto-generated credentials
- **Profile Management**: View and manage personal health information
- **Diet Chart Access**: View personalized diet recommendations
- **AI Chatbot**: Interactive Ayurveda consultant powered by Google Gemini AI
- **Health Tracking**: Monitor dosha balance and health metrics

### 🤖 AI Chatbot Features
- **Expert Knowledge**: Comprehensive Ayurveda guidance on doshas, herbs, and treatments
- **Real-time Responses**: Instant answers using Google Gemini AI
- **Interactive Interface**: Modern chat UI with quick question suggestions
- **Contextual Advice**: Personalized recommendations based on Ayurvedic principles

## 🏗️ Architecture

The application follows a modern microservices architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │───▶│  Node.js/Express│───▶│   MongoDB       │
│   (Port 5173)   │    │   (Port 5000)   │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Python Flask   │
                       │  Chatbot API    │
                       │   (Port 5001)   │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Google Gemini  │
                       │      AI API     │
                       └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router Dom** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js & Express** - Main application server
- **Python Flask** - Chatbot microservice
- **MongoDB & Mongoose** - Database and ODM
- **JSON Web Tokens** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI Integration
- **Google Gemini AI** - Advanced language model for chatbot
- **Python dotenv** - Environment variable management

## 📋 Prerequisites

Before running the application, ensure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v4.4 or higher)
- **Google AI Studio API Key** ([Get it here](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd college
```

### 2. Environment Setup

Create a `.env` file in the `server/` directory:
```env
GOOGLE_API_KEY=your_google_api_key_here
MONGODB_URI=mongodb://localhost:27017/ayurveda-clinic
JWT_SECRET=your_jwt_secret_here
```

### 3. Backend Setup (Node.js)

```bash
cd server
npm install
```

### 4. Python Chatbot API Setup

```bash
# Navigate to server directory
cd server

# Create virtual environment
python -m venv chatbot_env

# Activate virtual environment
# On macOS/Linux:
source chatbot_env/bin/activate
# On Windows:
# chatbot_env\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 5. Frontend Setup

```bash
cd client
npm install
```

## 🖥️ Running the Application

### Development Mode

You'll need to run 4 services in separate terminals:

#### Terminal 1 - MongoDB
```bash
mongod
```

#### Terminal 2 - Python Chatbot API
```bash
cd server
source chatbot_env/bin/activate  # Activate virtual environment
python ayurveda_chatbot_api.py
```
✅ Python API running on http://localhost:5001

#### Terminal 3 - Node.js Backend
```bash
cd server
npm run dev
```
✅ Express server running on http://localhost:5000

#### Terminal 4 - React Frontend
```bash
cd client
npm run dev
```
✅ React app running on http://localhost:5173

### Production Mode

For production deployment:

```bash
# Build React app
cd client
npm run build

# Start Node.js server
cd ../server
npm start

# Start Python API (in production environment)
source chatbot_env/bin/activate
python ayurveda_chatbot_api.py
```

## 📱 Usage Guide

### Getting Started

1. **Access the Application**: Open http://localhost:5173
2. **Admin Access**: Navigate to `/admin/dashboard` for doctor interface
3. **Patient Portal**: Use auto-generated credentials for patient login

### Admin Workflow

1. **Add Patients**: 
   - Go to Admin Dashboard → Patients → Add Patient
   - Fill in Ayurvedic assessment details
   - System auto-generates secure credentials

2. **Generate Diet Charts**:
   - Select patient → Generate Diet Chart
   - Customize based on dosha and health conditions
   - Save and share with patients

3. **Monitor Progress**:
   - View patient reports and analytics
   - Track dosha balance changes
   - Adjust treatments as needed

### Patient Workflow

1. **Login**: Use provided credentials to access patient portal
2. **View Profile**: Check personal health information and assessments
3. **Diet Charts**: Access personalized nutrition recommendations
4. **AI Consultation**: Chat with Ayurveda AI assistant for guidance

### Using the AI Chatbot

1. **Access**: Click "🤖 Ayurveda Chatbot" in patient dashboard
2. **Ask Questions**: Type queries about:
   - Dosha balancing techniques
   - Herbal remedies and treatments
   - Lifestyle recommendations
   - Seasonal routines (Ritucharya)
   - Diet and nutrition advice

3. **Quick Suggestions**: Use predefined question buttons for common queries

## 📊 Database Schema

### Patient Model
```javascript
{
  name: String,
  age: Number,
  gender: String,
  dominantPrakriti: String, // Vata, Pitta, Kapha
  dosha: String,
  lifestyle: String,
  existingDisease: String,
  bp: String,
  weight: Number,
  agni: String, // Mandya, Madhyama, Tikshna
  loginId: String, // Auto-generated
  password: String, // Auto-generated
  dietCharts: [{
    date: String,
    diet: {
      breakfast: [String],
      lunch: [String],
      dinner: [String],
      snacks: [String],
      restrictions: [String],
      recommendations: [String]
    },
    notes: String
  }],
  addedBy: String,
  createdAt: Date,
  lastLogin: Date
}
```

## 🔧 API Endpoints

### Patient Routes (`/api/patient`)
- `POST /login` - Patient authentication
- `GET /profile` - Get patient profile
- `GET /diet-charts` - Get all diet charts
- `GET /diet-chart/:index` - Get specific diet chart

### Doctor Routes (`/api/doctor`)
- `POST /add-patient` - Add new patient
- `GET /patients` - Get all patients
- `GET /patient/:id` - Get specific patient
- `PUT /patient/:id` - Update patient
- `POST /patient/:id/generate-diet` - Generate diet chart
- `DELETE /patient/:id` - Delete patient

### Chatbot Routes (`/api/chatbot`)
- `POST /ayurveda-chat` - Send message to AI chatbot

### Download Routes (`/api/download`)
- Various endpoints for generating PDFs and reports

## 🧪 Testing

### Manual Testing
1. **Frontend**: Test all user interfaces and interactions
2. **API**: Use tools like Postman to test backend endpoints
3. **Chatbot**: Verify AI responses and error handling
4. **Database**: Ensure data persistence and relationships

### Sample Test Data
```javascript
// Sample patient data for testing
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "dominantPrakriti": "Vata",
  "agni": "Madhyama",
  "weight": 70
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Chatbot Not Responding**
   - ✅ Check if Python API is running on port 5001
   - ✅ Verify Google API key in .env file
   - ✅ Ensure virtual environment is activated

2. **Database Connection Error**
   - ✅ Confirm MongoDB is running
   - ✅ Check connection string in environment variables
   - ✅ Verify database permissions

3. **Frontend Build Issues**
   - ✅ Clear node_modules and reinstall dependencies
   - ✅ Check for version conflicts
   - ✅ Ensure all peer dependencies are installed

4. **CORS Errors**
   - ✅ Verify CORS configuration in server.js
   - ✅ Check if frontend URL is allowed
   - ✅ Confirm ports are correctly configured

### Logs and Debugging

- **Frontend Logs**: Browser console (F12)
- **Backend Logs**: Terminal running Express server
- **Python API Logs**: Terminal running Flask app
- **Database Logs**: MongoDB logs directory

## 🔒 Security Considerations

### Authentication & Authorization
- JWT tokens for secure authentication
- Auto-generated strong passwords for patients
- Role-based access control (Admin vs Patient)

### Data Protection
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

### API Security
- Environment variables for sensitive data
- Rate limiting considerations for production
- Secure API key management

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT secret
- [ ] Configure production MongoDB instance
- [ ] Set up environment variables securely
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Build and optimize frontend assets

### Deployment Platforms
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, DigitalOcean, or AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Python API**: Heroku, PythonAnywhere, or cloud functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🙏 Acknowledgments

- **Google Gemini AI** for powering the intelligent chatbot
- **Ayurveda Community** for traditional knowledge and wisdom
- **Open Source Contributors** for the amazing tools and libraries used

---

**Built with ❤️ for modern Ayurveda practice**