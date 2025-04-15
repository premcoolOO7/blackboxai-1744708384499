import os
import uuid
from flask import Flask, request, render_template, url_for
from transformers import pipeline
from gtts import gTTS
from moviepy.editor import ImageClip, concatenate_videoclips, AudioFileClip
from diffusers import StableDiffusionPipeline
from dotenv import load_dotenv
import boto3

load_dotenv()

app = Flask(__name__)

# Initialize AWS S3 client
s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY")
)
BUCKET_NAME = "word-to-video-assets"

# Initialize AI models with error handling
try:
    nlp = pipeline("summarization", model="facebook/bart-large-cnn")
    stable_diffusion_model = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5")
except Exception as e:
    print(f"Model loading error: {e}")
    exit(1)

# Ensure static directories exist
os.makedirs("static/images", exist_ok=True)
os.makedirs("static/audio", exist_ok=True)
os.makedirs("static/videos", exist_ok=True)

def analyze_text(text):
    try:
        summary = nlp(text, max_length=100, min_length=30, do_sample=False)[0]["summary_text"]
        sentences = summary.split(". ")
        return [s.strip() for s in sentences if s.strip()]
    except Exception as e:
        print(f"Text analysis error: {e}")
        return [text[:100]]

def generate_visual(prompt):
    try:
        image = stable_diffusion_model(prompt).images[0]
        image_path = f"static/images/{uuid.uuid4()}.png"
        image.save(image_path)
        s3_client.upload_file(image_path, BUCKET_NAME, os.path.basename(image_path))
        return image_path
    except Exception as e:
        print(f"Image generation error: {e}")
        return "static/images/placeholder.png"

def generate_voiceover(text, lang="en"):
    try:
        tts = gTTS(text=text, lang=lang)
        audio_path = f"static/audio/{uuid.uuid4()}.mp3"
        tts.save(audio_path)
        return audio_path
    except Exception as e:
        print(f"Voiceover error: {e}")
        return None

def create_scene(image_path, audio_path, duration=5):
    try:
        image_clip = ImageClip(image_path).set_duration(duration)
        if audio_path and os.path.exists(audio_path):
            audio_clip = AudioFileClip(audio_path)
            image_clip = image_clip.set_audio(audio_clip)
        return image_clip
    except Exception as e:
        print(f"Scene creation error: {e}")
        return ImageClip(image_path).set_duration(duration)

def compile_video(scenes):
    try:
        video_clips = []
        for image_path, audio_path in scenes:
            clip = create_scene(image_path, audio_path)
            video_clips.append(clip)
        final_video = concatenate_videoclips(video_clips, method="compose")
        output_path = f"static/videos/{uuid.uuid4()}.mp4"
        final_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
        return output_path
    except Exception as e:
        print(f"Video compilation error: {e}")
        return None

@app.route("/", methods=["GET", "POST"])
def index():
    video_url = None
    error_message = None
    if request.method == "POST":
        text = request.form.get("text", "")
        if not text.strip():
            error_message = "Please enter some text to generate video."
        else:
            try:
                scenes = analyze_text(text)
                video_scenes = []
                for scene_text in scenes:
                    image_path = generate_visual(scene_text)
                    audio_path = generate_voiceover(scene_text)
                    video_scenes.append((image_path, audio_path))
                video_path = compile_video(video_scenes)
                if video_path:
                    video_url = url_for('static', filename=f"videos/{os.path.basename(video_path)}")
                else:
                    error_message = "Failed to generate video."
            except Exception as e:
                error_message = f"Error during video generation: {str(e)}"
    return render_template("index.html", video_url=video_url, error_message=error_message)

if __name__ == "__main__":
    app.run(debug=True)
