import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import uuid

load_dotenv()
client = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)
audio_url = (
    "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
)
response = requests.get(audio_url)
audio_data = BytesIO(response.content)
transcription = client.speech_to_text.convert(
    file=audio_data,
    model_id="scribe_v1", # Model to use, for now only "scribe_v1" is supported
    tag_audio_events=True, # Tag audio events like laughter, applause, etc.
    language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
    diarize=True, # Whether to annotate who is speaking
)
print(transcription)


def speech_to_text(audio_bytes: bytes) -> str:
    audio_data = BytesIO(audio_bytes)
    transcription = client.speech_to_text.convert(
        file=audio_data,
        model_id="scribe_v1",  # Model to use, for now only "scribe_v1" is supported
        tag_audio_events=True,  # Tag audio events like laughter, applause, etc.
        language_code="eng",  # Language of the audio file. If set to None, the model will detect the language automatically.
        diarize=True,  # Whether to annotate who is speaking
    )
    return transcription

def text_to_speech(text: str) -> bytes:
    audio = client.text_to_speech.convert(
        text=text,
        voice_id="EXAVITQu4vr4xnSDxMaL",  # Default voice
        model_id="eleven_multilingual_v2",
    )
    
    audio_bytes = BytesIO(audio)
    
    # Generating a unique file name for the output MP3 file
    save_file_path = f"{uuid.uuid4()}.mp3"
    # Writing the audio to a file
    with open(save_file_path, "wb") as f:
        for chunk in response:
            if chunk:
                f.write(chunk)
    print(f"{save_file_path}: A new audio file was saved successfully!")
    # Return the path of the saved audio file
    
    return audio_bytes.getvalue()
        
    