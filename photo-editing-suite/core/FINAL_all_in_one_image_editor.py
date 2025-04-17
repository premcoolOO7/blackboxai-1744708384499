import os
import torch
from flask import Flask, request, send_file, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from diffusers import StableDiffusionPipeline
from gtts import gTTS
from moviepy.editor import ImageSequenceClip, AudioFileClip
import uuid

# Configuration
STABLE_DIFFUSION_MODEL = "runwayml/stable-diffusion-v1-5"
TEXT_PROCESSOR_MODEL = "t5-small"
OUTPUT_DIR = "generated_videos"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Initialize Flask App
app = Flask(__name__)

# ======================
# AI Pipeline Components
# ======================

class TextProcessor:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained(TEXT_PROCESSOR_MODEL)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(TEXT_PROCESSOR_MODEL)

    def generate_scenes(self, text):
        inputs = self.tokenizer("generate scenes: " + text, return_tensors="pt", max_length=512, truncation=True)
        outputs = self.model.generate(inputs.input_ids, max_length=256)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True).split("; ")

class ImageGenerator:
    def __init__(self):
        self.pipe = StableDiffusionPipeline.from_pretrained(STABLE_DIFFUSION_MODEL, torch_dtype=torch.float16)
        self.pipe = self.pipe.to("cuda") if torch.cuda.is_available() else self.pipe.to("cpu")

    def generate_image(self, prompt, output_path):
        image = self.pipe(prompt).images[0]
        image.save(output_path)

class AudioGenerator:
    def generate_audio(self, text, output_path, language="en"):
        tts = gTTS(text=text, lang=language, slow=False)
        tts.save(output_path)

class VideoCompiler:
    def compile_video(self, image_paths, audio_path, output_path, duration_per_scene=3):
        clip = ImageSequenceClip(image_paths, durations=[duration_per_scene]*len(image_paths))
        audio = AudioFileClip(audio_path)
        final_clip = clip.set_audio(audio)
        final_clip.write_videofile(output_path, codec="libx264", fps=24)

# ======================
# Web API Endpoints
# ======================

@app.route('/generate', methods=['POST'])
def generate_video():
    try:
        # Get input data
        data = request.json
        input_text = data.get('text', '')
        if not input_text:
            return jsonify({"error": "No text provided"}), 400

        # Generate unique ID for the session
        session_id = str(uuid.uuid4())
        os.makedirs(f"{OUTPUT_DIR}/{session_id}", exist_ok=True)

        # Initialize components
        text_processor = TextProcessor()
        image_gen = ImageGenerator()
        audio_gen = AudioGenerator()
        video_compiler = VideoCompiler()

        # Step 1: Generate scenes
        scenes = text_processor.generate_scenes(input_text)
        
        # Step 2: Generate images
        image_paths = []
        for idx, scene in enumerate(scenes):
            img_path = f"{OUTPUT_DIR}/{session_id}/scene_{idx}.png"
            image_gen.generate_image(scene, img_path)
            image_paths.append(img_path)

        # Step 3: Generate audio
        audio_path = f"{OUTPUT_DIR}/{session_id}/audio.mp3"
        audio_gen.generate_audio(input_text, audio_path)

        # Step 4: Compile video
        output_path = f"{OUTPUT_DIR}/{session_id}/output.mp4"
        video_compiler.compile_video(image_paths, audio_path, output_path)

        return send_file(output_path, mimetype='video/mp4', as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Word-to-Video Converter API - POST JSON with 'text' to /generate"

# ======================
# Main Execution
# ======================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
