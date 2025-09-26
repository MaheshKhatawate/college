from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv(".env")

# Configure Google AI
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

# Initialize the model
model = genai.GenerativeModel('gemini-1.5-flash')

# Ayurveda context prompt
AYURVEDA_CONTEXT = """
You are an expert Ayurveda consultant with deep knowledge of traditional Ayurvedic medicine, herbs, treatments, and wellness practices. 
You provide helpful, accurate information about:
- The three doshas (Vata, Pitta, Kapha)
- Ayurvedic herbs and their properties
- Traditional treatments and therapies
- Diet and lifestyle recommendations
- Panchakarma and detoxification
- Seasonal and daily routines (Dinacharya/Ritucharya)
- Natural remedies for common ailments
- Mind-body balance and wellness

Always provide safe, educational information and remind users to consult qualified Ayurvedic practitioners for personalized treatment.
If you have been asked any questio outside of the Ayrveda domain and If user tries to say any thing outside of Ayurveda just reply saying ""I am specialized in Ayurveda and cannot provide information outside of this domain.""
"""

@app.route('/api/ayurveda-chat', methods=['POST'])
def ayurveda_chat():
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        # Create the prompt with context
        prompt = f"{AYURVEDA_CONTEXT}\n\nUser Question: {question}\n\nAnswer:"
        
        # Generate response
        response = model.generate_content(prompt)
        answer = response.text
        
        return jsonify({'answer': answer})
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Failed to process question: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Ayurveda Chatbot API is running'})

if __name__ == '__main__':
    print("Starting Ayurveda Chatbot API...")
    print("Make sure you have GOOGLE_API_KEY in your .env file")
    app.run(host='0.0.0.0', port=5001, debug=True)
