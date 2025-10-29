from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# This enables CORS for all domains, which is fine for development.
# For production, you might want to restrict it to your Netlify domain.
CORS(app)

@app.route('/submit', methods=['POST'])
def submit_form():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()

    # For now, we just print the data to the console to confirm it's received.
    print("Received data:", data)

    # In the next step, we will add the email sending logic here.

    return jsonify({"result": "success", "message": "Data received successfully"})

if __name__ == '__main__':
    # Runs the app on http://127.0.0.1:5000
    app.run(debug=True, port=5000)
