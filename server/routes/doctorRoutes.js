const express = require('express');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');

const router = express.Router();

// Generate diet chart based on patient's Ayurvedic profile
function generateDietChart(patient) {
    const date = new Date().toISOString();
    const baseDiet = { 
        breakfast: [], 
        lunch: [], 
        dinner: [], 
        snacks: [], 
        restrictions: [], 
        recommendations: [] 
    };
    
    // Diet generation logic based on dominant Prakriti
    switch (patient.dominantPrakriti) {
        case "Vata":
            baseDiet.breakfast = ["Warm oatmeal with nuts", "Hot milk with turmeric", "Stewed fruits"];
            baseDiet.lunch = ["Warm rice", "Yellow dal", "Cooked vegetables", "Ghee"];
            baseDiet.dinner = ["Vegetable soup", "Whole grain bread", "Light curry"];
            baseDiet.snacks = ["Soaked almonds", "Warm herbal tea", "Dates"];
            baseDiet.restrictions = ["Cold foods", "Raw vegetables", "Carbonated drinks"];
            baseDiet.recommendations = ["Eat warm foods", "Regular meal times", "Include healthy fats"];
            break;
        case "Pitta":
            baseDiet.breakfast = ["Sweet fruits", "Coconut water", "Wheat porridge"];
            baseDiet.lunch = ["Basmati rice", "Green vegetables", "Cucumber salad"];
            baseDiet.dinner = ["Light khichdi", "Cooling vegetables", "Buttermilk"];
            baseDiet.snacks = ["Fresh fruits", "Coconut pieces", "Rose tea"];
            baseDiet.restrictions = ["Spicy foods", "Fermented foods", "Excessive salt"];
            baseDiet.recommendations = ["Cool or room temperature foods", "Light meals", "Avoid skipping meals"];
            break;
        case "Kapha":
            baseDiet.breakfast = ["Light fruits", "Dry toast", "Green tea"];
            baseDiet.lunch = ["Quinoa", "Steamed vegetables", "Lentil soup"];
            baseDiet.dinner = ["Millet roti", "Grilled vegetables", "Clear soup"];
            baseDiet.snacks = ["Roasted seeds", "Spiced tea", "Apple"];
            baseDiet.restrictions = ["Heavy dairy", "Fried foods", "Excessive sweets"];
            baseDiet.recommendations = ["Light and dry foods", "Warm foods", "Exercise before meals"];
            break;
        default:
            baseDiet.recommendations = ["Please consult for personalized diet plan"];
    }
    
    // Additional recommendations based on Agni
    if (patient.agni === "Mandya") {
        baseDiet.recommendations.push("Small, frequent meals", "Easy to digest foods", "Avoid heavy foods");
    } else if (patient.agni === "Tikshna") {
        baseDiet.recommendations.push("Regular sized meals", "Include cooling foods", "Avoid excessive spices");
    }
    
    return { 
        date, 
        diet: baseDiet, 
        notes: `Diet chart generated for ${patient.name}` 
    };
}

// Doctor adds a new patient (with auto-generated credentials)
router.post('/add-patient', async (req, res) => {
    try {
        const {
            name,
            age,
            gender,
            dominantPrakriti,
            dosha,
            lifestyle,
            existingDisease,
            bp,
            weight,
            agni,
            addedBy
        } = req.body;

        // Validate required fields
        if (!name || !gender || !dominantPrakriti || !agni || !addedBy) {
            return res.status(400).json({
                success: false,
                message: 'Name, gender, dominantPrakriti, agni, and addedBy are required fields'
            });
        }

        // Generate unique login credentials
        let loginId;
        let isUnique = false;
        
        // Ensure loginId is unique
        while (!isUnique) {
            loginId = Patient.generateLoginId();
            const existingPatient = await Patient.findOne({ loginId });
            if (!existingPatient) {
                isUnique = true;
            }
        }

        const password = Patient.generatePassword();
        
        // Hash the password for storage
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new patient
        const newPatient = new Patient({
            name,
            age: age || undefined,
            gender,
            dominantPrakriti,
            dosha,
            lifestyle,
            existingDisease,
            bp,
            weight: weight || undefined,
            agni,
            loginId,
            password: hashedPassword,
            dietCharts: [],
            addedBy
        });

        await newPatient.save();

        // Return patient info with plain text credentials for doctor to share
        res.status(201).json({
            success: true,
            message: 'Patient added successfully',
            patient: {
                id: newPatient._id,
                name: newPatient.name,
                age: newPatient.age,
                gender: newPatient.gender,
                dominantPrakriti: newPatient.dominantPrakriti,
                dosha: newPatient.dosha,
                lifestyle: newPatient.lifestyle,
                existingDisease: newPatient.existingDisease,
                bp: newPatient.bp,
                weight: newPatient.weight,
                agni: newPatient.agni,
                loginId: newPatient.loginId,
                password: password, // Plain text password for doctor to share
                dietCharts: newPatient.dietCharts,
                createdAt: newPatient.createdAt
            }
        });

    } catch (error) {
        console.error('Error adding patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add patient',
            error: error.message
        });
    }
});

// Get all patients for doctor view
router.get('/patients', async (req, res) => {
    try {
        const { addedBy } = req.query;
        
        let query = {};
        if (addedBy) {
            query.addedBy = addedBy;
        }

        const patients = await Patient.find(query)
            .select('-password') // Don't include hashed password
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            patients
        });

    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    }
});

// Get specific patient details for doctor
router.get('/patient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const patient = await Patient.findById(id).select('-password');
        
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
        console.error('Error fetching patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patient',
            error: error.message
        });
    }
});

// Update patient information
router.put('/patient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove loginId and password from update data to prevent accidental changes
        delete updateData.loginId;
        delete updateData.password;

        const patient = await Patient.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            patient
        });

    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update patient',
            error: error.message
        });
    }
});

// Generate diet chart for a patient
router.post('/patient/:id/generate-diet', async (req, res) => {
    try {
        const { id } = req.params;
        
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const newDietChart = generateDietChart(patient);
        
        patient.dietCharts.push(newDietChart);
        await patient.save();

        res.status(200).json({
            success: true,
            message: `Diet chart generated for ${patient.name}`,
            dietChart: newDietChart
        });

    } catch (error) {
        console.error('Error generating diet chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate diet chart',
            error: error.message
        });
    }
});

// Update specific diet chart
router.put('/patient/:id/diet-chart/:chartIndex', async (req, res) => {
    try {
        const { id, chartIndex } = req.params;
        const { diet, notes } = req.body;
        
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const index = parseInt(chartIndex);
        if (index < 0 || index >= patient.dietCharts.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid diet chart index'
            });
        }

        patient.dietCharts[index].diet = diet;
        patient.dietCharts[index].notes = notes;
        
        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Diet chart updated successfully',
            dietChart: patient.dietCharts[index]
        });

    } catch (error) {
        console.error('Error updating diet chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update diet chart',
            error: error.message
        });
    }
});

// Delete specific diet chart
router.delete('/patient/:id/diet-chart/:chartIndex', async (req, res) => {
    try {
        const { id, chartIndex } = req.params;
        
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const index = parseInt(chartIndex);
        if (index < 0 || index >= patient.dietCharts.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid diet chart index'
            });
        }

        patient.dietCharts.splice(index, 1);
        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Diet chart deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting diet chart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete diet chart',
            error: error.message
        });
    }
});

// Delete patient
router.delete('/patient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const patient = await Patient.findByIdAndDelete(id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete patient',
            error: error.message
        });
    }
});

// Get patient credentials (including generated password for doctor to share)
router.get('/patient/:id/credentials', async (req, res) => {
    try {
        const { id } = req.params;
        
        const patient = await Patient.findById(id);
        
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Generate a new password for the patient (since we can't retrieve the original)
        const newPassword = Patient.generatePassword();
        
        // Update the patient with the new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        patient.password = hashedPassword;
        await patient.save();

        res.status(200).json({
            success: true,
            message: 'Patient credentials retrieved (password reset)',
            credentials: {
                name: patient.name,
                loginId: patient.loginId,
                password: newPassword, // Plain text password for doctor to share
                isNewPassword: true
            }
        });

    } catch (error) {
        console.error('Error retrieving patient credentials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve patient credentials',
            error: error.message
        });
    }
});

module.exports = router;