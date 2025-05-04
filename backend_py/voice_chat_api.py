import os
from dotenv import load_dotenv
from io import BytesIO
import requests
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import uuid
from diabetes_rag_agent import rag_agent
from typing import Optional, List, Dict, Any, Tuple
import re

load_dotenv()
client = ElevenLabs(
  api_key=os.getenv("ELEVENLABS_API_KEY"),
)

def speech_to_text(audio_bytes: bytes) -> str:
    audio_data = BytesIO(audio_bytes)
    transcription = client.speech_to_text.convert(
        file=audio_data,
        model_id="scribe_v1",  # Model to use, for now only "scribe_v1" is supported
        tag_audio_events=False,  # Disable tagging non-speech events
        language_code="eng",  # Language of the audio file. If set to None, the model will detect the language automatically.
        diarize=True,  # Whether to annotate who is speaking
    )
    return transcription

def text_to_speech(text: str) -> bytes:
    audio_stream = client.text_to_speech.convert(
        text=text,
        voice_id="EXAVITQu4vr4xnSDxMaL",
        model_id="eleven_turbo_v2_5",    # newer model that supports language_code
        output_format="mp3_44100_128",  # ensure MP3 format
        language_code="en",              # force English pronunciation
    )
    # Collect chunks into a single bytes object if the response is a generator
    if not isinstance(audio_stream, (bytes, bytearray)):
        buffer = BytesIO()
        for chunk in audio_stream:
            buffer.write(chunk)
        return buffer.getvalue()
    return audio_stream

def voice_agent(audio_bytes: bytes,
                category: Optional[str] = None,
                conversation_history: Optional[List[Dict[str, str]]] = None
) -> Tuple[bytes, List[str], str, str]:
    
    # Ensure audio_bytes is actual bytes (convert from list if needed)
    if isinstance(audio_bytes, list):
        audio_bytes = bytes(audio_bytes)
    # Convert speech to text
    transcription_data = speech_to_text(audio_bytes)
    # Extract text string (handle objects with .text attribute)
    raw_text = transcription_data.text if hasattr(transcription_data, 'text') else transcription_data
    # Remove any parenthetical event tags e.g. "(laughter)", "(techno music)"
    clean_text = re.sub(r"\([^)]*\)", "", raw_text).strip()
    question_text = clean_text
    
    # Append a short answer request
    question = f"{question_text}. Please provide a short answer, less than 50 words."
    print(f"Transcription: {question}")
    
    # Do text based RAG
    executor_state = rag_agent.answer_question(
        question=question,
        category=category,
        conversation_history=conversation_history
    )
    
    print(f"executor_state: {executor_state}")
    
    answer_text: str = executor_state['answer']
    followup_questions: List[str] = executor_state['followupQuestions']
    
    print(f"voice agent raw answer and followups: {answer_text}, {followup_questions}")
    
    # Generate speech from the combined text
    audio_bytes = text_to_speech(answer_text)
    
    # return audio, follow-ups, and transcripts
    return audio_bytes, followup_questions, question_text, answer_text

