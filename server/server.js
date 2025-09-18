const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

// Import routes
const doctorRoutes = require('./routes/doctorRoutes')
const patientRoutes = require('./routes/patientRoutes')
const downloadRoutes = require('./routes/downloadRoutes')

// Connecting mongoDB
mongoose.connect("mongodb://localhost:27017/ayurveda-clinic").then(
    ()=>console.log('MongoDB connected.')
).catch(
    error=>console.log(error)
)

const app=express()
const PORT = 5000;

app.use(
    cors({
        origin : 'http://localhost:5173',
         methods : ['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            'Content-Type',
            'Authorization',
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())

// Routes
app.use('/api/doctor', doctorRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/download', downloadRoutes)

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' })
})

app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`)
})