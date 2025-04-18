# app.py
import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, render_template, request, send_file
from PIL import Image
from rembg import remove
import requests
from io import BytesIO

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['RESULTS_FOLDER'] = 'results'
app.config['API_KEY'] = 'your_stability_ai_api_key'  # Replace with actual API key

# Create directories if they don't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['RESULTS_FOLDER'], exist_ok=True)

# Load style transfer model once
style_transfer_model = tf.hub.load('https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2', 
                                  'arbitrary_image_stylization')

def process_image_path(file):
    """Helper function to handle file uploads"""
    filename = file.filename
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(input_path)
    return input_path, filename

@app.route('/')
def home():
    return render_template('editor.html')

@app.route('/remove_bg', methods=['POST'])
def remove_bg():
    file = request.files['file']
    input_path, filename = process_image_path(file)
    output_path = os.path.join(app.config['RESULTS_FOLDER'], f'no_bg_{filename}')
    
    input_img = Image.open(input_path)
    output_img = remove(input_img)
    output_img.save(output_path)
    
    return send_file(output_path, as_attachment=True)

@app.route('/style_transfer', methods=['POST'])
def style_transfer():
    content_file = request.files['content']
    style_file = request.files['style']
    
    content_path, content_name = process_image_path(content_file)
    style_path, style_name = process_image_path(style_file)
    
    output_path = os.path.join(app.config['RESULTS_FOLDER'], f'styled_{content_name}')

    content_img = tf.image.decode_image(tf.io.read_file(content_path))
    style_img = tf.image.decode_image(tf.io.read_file(style_path))
    
    stylized_img = style_transfer_model(tf.constant(content_img), tf.constant(style_img))[0]
    cv2.imwrite(output_path, cv2.cvtColor(np.squeeze(stylized_img.numpy()), cv2.COLOR_RGB2BGR))
    
    return send_file(output_path, as_attachment=True)

@app.route('/text_to_image', methods=['POST'])
def text_to_image():
    prompt = request.form['prompt']
    output_path = os.path.join(app.config['RESULTS_FOLDER'], 'generated.png')
    
    headers = {"Authorization": f"Bearer {app.config['API_KEY']}"}
    data = {"prompt": prompt, "width": 512, "height": 512}
    
    response = requests.post("https://api.stability.ai/v2beta/stable-image/generate/core",
                           headers=headers, json=data)
    
    if response.status_code == 200:
        with open(output_path, 'wb') as f:
            f.write(response.content)
        return send_file(output_path, as_attachment=True)
    else:
        return f"Error: {response.text}", 400

@app.route('/auto_enhance', methods=['POST'])
def auto_enhance():
    file = request.files['file']
    input_path, filename = process_image_path(file)
    output_path = os.path.join(app.config['RESULTS_FOLDER'], f'enhanced_{filename}')
    
    img = cv2.imread(input_path)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    lab = cv2.merge((l, a, b))
    enhanced_img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    cv2.imwrite(output_path, enhanced_img)
    
    return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)