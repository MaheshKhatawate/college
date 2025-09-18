const express = require('express');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'patient_jwt_secret_key';

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

// Generate HTML template for diet chart
function generateDietChartHTML(patient, dietChart, chartIndex) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Diet Chart - ${patient.name}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8f9fa;
                color: #333;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                border-bottom: 3px solid #10b981;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .header h1 {
                color: #10b981;
                margin: 0 0 10px 0;
                font-size: 2.5em;
            }
            .header h2 {
                color: #666;
                margin: 0;
                font-weight: normal;
                font-size: 1.2em;
            }
            .patient-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
                border-left: 4px solid #10b981;
            }
            .patient-info h3 {
                margin-top: 0;
                color: #10b981;
            }
            .diet-section {
                margin-bottom: 25px;
                padding: 20px;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                background: #fff;
            }
            .diet-section h3 {
                color: #495057;
                margin-top: 0;
                padding-bottom: 10px;
                border-bottom: 2px solid #e9ecef;
                text-transform: uppercase;
                font-size: 1.1em;
                letter-spacing: 0.5px;
            }
            .meal-section {
                background: #f8f9fa;
                padding: 15px;
                margin: 15px 0;
                border-radius: 6px;
                border-left: 4px solid #17a2b8;
            }
            .meal-section h4 {
                color: #17a2b8;
                margin: 0 0 10px 0;
                text-transform: capitalize;
                font-size: 1em;
            }
            .restrictions {
                border-left-color: #dc3545 !important;
            }
            .restrictions h4 {
                color: #dc3545 !important;
            }
            .recommendations {
                border-left-color: #28a745 !important;
            }
            .recommendations h4 {
                color: #28a745 !important;
            }
            ul {
                margin: 0;
                padding-left: 20px;
            }
            li {
                margin-bottom: 5px;
                line-height: 1.4;
            }
            .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
                color: #6c757d;
                font-size: 0.9em;
            }
            .date-info {
                background: #e3f2fd;
                padding: 10px 15px;
                border-radius: 6px;
                margin-bottom: 20px;
                border-left: 4px solid #2196f3;
            }
            .notes {
                background: #fff3cd;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #ffc107;
                margin-top: 20px;
            }
            .notes h4 {
                color: #856404;
                margin-top: 0;
            }
            .ayurveda-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            .info-card {
                background: #e8f5e8;
                padding: 12px;
                border-radius: 6px;
                text-align: center;
                border: 1px solid #c3e6c3;
            }
            .info-card strong {
                color: #155724;
                display: block;
                margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Ayurvedic Diet Chart</h1>
                <h2>Personalized Nutrition Plan</h2>
            </div>

            <div class="patient-info">
                <h3>Patient Information</h3>
                <div class="ayurveda-info">
                    <div class="info-card">
                        <strong>Name</strong>
                        ${patient.name}
                    </div>
                    <div class="info-card">
                        <strong>Age</strong>
                        ${patient.age || 'N/A'}
                    </div>
                    <div class="info-card">
                        <strong>Gender</strong>
                        ${patient.gender}
                    </div>
                    <div class="info-card">
                        <strong>Dominant Prakriti</strong>
                        ${patient.dominantPrakriti}
                    </div>
                    <div class="info-card">
                        <strong>Agni Type</strong>
                        ${patient.agni}
                    </div>
                </div>
            </div>

            <div class="date-info">
                <strong>Diet Chart #${chartIndex + 1}</strong> - Generated on ${new Date(dietChart.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}
            </div>

            <div class="diet-section">
                <h3>Daily Meal Plan</h3>
                
                <div class="meal-section">
                    <h4>🌅 Breakfast</h4>
                    <ul>
                        ${dietChart.diet.breakfast.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="meal-section">
                    <h4>☀️ Lunch</h4>
                    <ul>
                        ${dietChart.diet.lunch.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="meal-section">
                    <h4>🌙 Dinner</h4>
                    <ul>
                        ${dietChart.diet.dinner.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="meal-section">
                    <h4>🍎 Snacks</h4>
                    <ul>
                        ${dietChart.diet.snacks.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="diet-section">
                <div class="meal-section restrictions">
                    <h4>🚫 Food Restrictions</h4>
                    <ul>
                        ${dietChart.diet.restrictions.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="meal-section recommendations">
                    <h4>✅ Recommendations</h4>
                    <ul>
                        ${dietChart.diet.recommendations.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>

            ${dietChart.notes ? `
            <div class="notes">
                <h4>Additional Notes</h4>
                <p>${dietChart.notes}</p>
            </div>
            ` : ''}

            <div class="footer">
                <p>This diet chart is based on Ayurvedic principles and your individual constitution (Prakriti).</p>
                <p>Please consult with your healthcare provider for any specific dietary concerns.</p>
                <p><strong>Patient ID:</strong> ${patient.loginId} | <strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Download diet chart as PDF
router.get('/download-pdf/:index', verifyPatientToken, async (req, res) => {
    try {
        const { index } = req.params;
        
        const patient = await Patient.findById(req.patient.patientId);
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

        const dietChart = patient.dietCharts[chartIndex];
        const html = generateDietChartHTML(patient, dietChart, chartIndex);

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="diet-chart-${patient.name.replace(/\s+/g, '-')}-${chartIndex + 1}.pdf"`);
        
        res.send(pdf);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF',
            error: error.message
        });
    }
});

// Download diet chart as JPEG
router.get('/download-image/:index', verifyPatientToken, async (req, res) => {
    try {
        const { index } = req.params;
        
        const patient = await Patient.findById(req.patient.patientId);
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

        const dietChart = patient.dietCharts[chartIndex];
        const html = generateDietChartHTML(patient, dietChart, chartIndex);

        // Generate image using Puppeteer
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setViewport({ width: 800, height: 1200 });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const screenshot = await page.screenshot({
            type: 'jpeg',
            quality: 90,
            fullPage: true
        });

        await browser.close();

        // Set response headers for image download
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', `attachment; filename="diet-chart-${patient.name.replace(/\s+/g, '-')}-${chartIndex + 1}.jpg"`);
        
        res.send(screenshot);

    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate image',
            error: error.message
        });
    }
});

module.exports = router;