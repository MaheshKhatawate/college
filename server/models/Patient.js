const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    // Basic patient information
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        min: 1,
        max: 150
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    
    // Ayurvedic fields from current frontend
    dominantPrakriti: {
        type: String,
        required: true,
        enum: ['Vata', 'Pitta', 'Kapha']
    },
    dosha: {
        type: String,
        trim: true
    },
    lifestyle: {
        type: String,
        trim: true
    },
    existingDisease: {
        type: String,
        trim: true
    },
    bp: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^\d{2,3}\/\d{2,3}$/.test(v);
            },
            message: 'BP must be in format like 120/80'
        }
    },
    weight: {
        type: Number,
        min: 1
    },
    agni: {
        type: String,
        required: true,
        enum: ['Mandya', 'Madhyama', 'Tikshna']
    },
    
    // Auto-generated login credentials
    loginId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    // Diet charts array (following current structure)
    dietCharts: [{
        date: {
            type: String,
            required: true
        },
        diet: {
            breakfast: [String],
            lunch: [String],
            dinner: [String],
            snacks: [String],
            restrictions: [String],
            recommendations: [String]
        },
        notes: {
            type: String,
            trim: true
        }
    }],
    
    // Doctor who added this patient
    addedBy: {
        type: String,
        required: true
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
});

// Generate unique login ID
patientSchema.statics.generateLoginId = function() {
    const prefix = 'PAT';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
};

// Generate random password
patientSchema.statics.generatePassword = function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

module.exports = mongoose.model('Patient', patientSchema);