from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import os

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your OpenAI API key here or via environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

class PromptRequest(BaseModel):
    prompt: str

@app.post("/api/generate")
async def generate_tool(request: PromptRequest):
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")

    try:
        # Call OpenAI GPT-4 to generate tool scaffolding based on prompt
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert software engineer who generates React + Tailwind CSS frontend code scaffolding based on user requirements."},
                {"role": "user", "content": f"Generate a React + Tailwind CSS frontend code scaffold for this tool: {request.prompt}"}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        code = response.choices[0].message.content.strip()
        return {"code": code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
