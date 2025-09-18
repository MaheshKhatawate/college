const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'patient_jwt_secret_key';

// Patient login
router.post('/login', async (req, res) => {
    try {
        const { loginId, password } = req.body;

        // Validate input
        if (!loginId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Login ID and password are required'
            });
        }

        // Find patient by loginId
        const patient = await Patient.findOne({ loginId });
        if (!patient) {
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, patient.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials'
            });
        }

        // Update last login
        patient.lastLogin = new Date();
        await patient.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                patientId: patient._id,
                loginId: patient.loginId 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            patient: {
                id: patient._id,
                name: patient.name,
                loginId: patient.loginId,
                lastLogin: patient.lastLogin
            }
        });

    } catch (error) {
        console.error('Error during patient login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Middleware to verify patient JWT token
const verifyPatientToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.patient = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Get patient's own profile and diet charts
router.get('/profile', verifyPatientToken, async (req, res) => {
    try {
        const patient = await Patient.findById(req.patient.patientId)
            .select('-password'); // Don't include password

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            patient
        });

    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Get patient's diet charts
router.get('/diet-charts', verifyPatientToken, async (req, res) => {
    try {
        const patient = await Patient.findById(req.patient.patientId)
            .select('name dietCharts');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            patient: {
                name: patient.name,
                dietCharts: patient.dietCharts || []
            }
        });

    } catch (error) {
        console.error('Error fetching diet charts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch diet charts',
            error: error.message
        });
    }
});

// Get specific diet chart
router.get('/diet-chart/:index', verifyPatientToken, async (req, res) => {
    try {
        const { index } = req.params;
        
        const patient = await Patient.findById(req.patient.patientId)
            .select('name dietCharts');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const chartIndex = parseInt(index);
        if (chartIndex < 0 || chartIndex >= patient.dietCharts.length) {
            return res.status(404).json({
                success: false,
                message: 'Diet chart not found'
            });
        }

        res.status(200).json({
            success: true,
            patient: {
                name: patient.name
            },
            dietChart: patient.dietCharts[chartIndex]
        });

    } catch (error) {
        console.error('Error fetching diet chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch diet chart',
            error: error.message
        });
    }
});

module.exports = router;