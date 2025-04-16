from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'
CORS(app, supports_credentials=True)

# In-memory user store (replace with database in production)
users = {}

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Email and password required'}), 400
    if email in users:
        return jsonify({'message': 'User already exists'}), 400
    hashed_password = generate_password_hash(password)
    users[email] = {'id': str(uuid.uuid4()), 'email': email, 'password': hashed_password}
    return jsonify({'message': 'User created successfully'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = users.get(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401
    session['user_id'] = user['id']
    session['email'] = user['email']
    return jsonify({'message': 'Login successful', 'user': {'id': user['id'], 'email': user['email']}})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/status', methods=['GET'])
def status():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'user': {'id': session['user_id'], 'email': session['email']}})
    else:
        return jsonify({'logged_in': False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
