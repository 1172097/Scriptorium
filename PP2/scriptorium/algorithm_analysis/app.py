from flask import Flask, request, jsonify
from predict import CodePredictor
from flask_cors import CORS


app = Flask(__name__)
predictor = CodePredictor()
CORS(app)  # This enables CORS for all routes and origins


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Validate input
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        if 'input' not in data:
            return jsonify({'error': 'Missing input field'}), 400

        # Extract contexts and predict
        predicted_label, confidence, weight = predictor.predict(data['input'])

        
        return jsonify({'prediction': predicted_label, 'confidence': confidence})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)