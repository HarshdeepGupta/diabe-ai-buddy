import { OpenAI } from 'openai';
import { recordVoiceInput, playVoiceOutput } from '@langchain/io';
import logger from './logger';
import { getApiKey } from './env';

export interface AudioOptions {
  timeout?: number;  // Timeout in seconds
  volume?: number;   // Volume level (0-1)
  cancelSignal?: AbortSignal;  // For cancellation
  voice?: string;    // Voice ID for TTS
  language?: string; // Language code for TTS
}

export class AudioError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'AudioError';
  }
}

// Initialize OpenAI client for Whisper
const openai = new OpenAI({
  apiKey: getApiKey('OPENAI_API_KEY')
});

// OpenTTS configuration
const OPENTTS_URL = process.env.OPENTTS_URL || 'http://localhost:5500';
const DEFAULT_VOICE = 'en_US/vctk_low';
const DEFAULT_LANGUAGE = 'en';

/**
 * Transcribes audio input to text using Whisper API
 * @param audioData - The audio data to transcribe
 * @param options - Optional configuration
 * @returns The transcribed text
 */
export async function transcribeAudioInput(audioData: Buffer, options: AudioOptions = {}): Promise<string> {
  try {
    if (options.cancelSignal?.aborted) {
      throw new AudioError('Transcription cancelled', 'CANCELLED');
    }

    const controller = new AbortController();
    const timeoutId = options.timeout ? setTimeout(() => controller.abort(), options.timeout * 1000) : null;
    
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: audioData,
        model: "whisper-1",
        response_format: "text"
      });
      return transcription;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof AudioError) throw error;
    logger.error('Error transcribing audio:', error);
    throw new AudioError('Failed to transcribe audio', 'TRANSCRIPTION_ERROR');
  }
}

/**
 * Converts text to speech using OpenTTS
 * @param text - The text to convert to speech
 * @param options - Optional configuration
 * @returns The audio data as a Buffer
 */
export async function textToSpeech(text: string, options: AudioOptions = {}): Promise<Buffer> {
  try {
    if (options.cancelSignal?.aborted) {
      throw new AudioError('Speech synthesis cancelled', 'CANCELLED');
    }

    const controller = new AbortController();
    const timeoutId = options.timeout ? setTimeout(() => controller.abort(), options.timeout * 1000) : null;
    
    try {
      const response = await fetch(`${OPENTTS_URL}/api/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: options.voice || DEFAULT_VOICE,
          vocoder: 'high',
          denoiserStrength: 0.005,
          cache: false,
          ssml: false,
          ssmlNumbers: true,
          language: options.language || DEFAULT_LANGUAGE,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AudioError(`OpenTTS API error: ${response.statusText}`, 'TTS_API_ERROR');
      }

      const audioData = await response.arrayBuffer();
      return Buffer.from(audioData);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof AudioError) throw error;
    logger.error('Error synthesizing speech:', error);
    throw new AudioError('Failed to synthesize speech', 'SYNTHESIS_ERROR');
  }
}

/**
 * Records voice input from the user
 * @param duration - Optional duration in seconds to record (default: 5 seconds)
 * @param options - Optional configuration
 * @returns The recorded audio data as a Buffer
 */
export async function recordVoice(duration: number = 5, options: AudioOptions = {}): Promise<Buffer> {
  try {
    if (options.cancelSignal?.aborted) {
      throw new AudioError('Recording cancelled', 'CANCELLED');
    }

    const controller = new AbortController();
    const timeoutId = options.timeout ? setTimeout(() => controller.abort(), options.timeout * 1000) : null;
    
    try {
      const audioData = await recordVoiceInput(duration, { signal: controller.signal });
      return audioData;
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof AudioError) throw error;
    logger.error('Error recording voice:', error);
    throw new AudioError('Failed to record voice input', 'RECORDING_ERROR');
  }
}

/**
 * Plays audio output
 * @param audioData - The audio data to play
 * @param options - Optional configuration
 */
export async function playAudio(audioData: Buffer, options: AudioOptions = {}): Promise<void> {
  try {
    if (options.cancelSignal?.aborted) {
      throw new AudioError('Playback cancelled', 'CANCELLED');
    }

    const controller = new AbortController();
    const timeoutId = options.timeout ? setTimeout(() => controller.abort(), options.timeout * 1000) : null;
    
    try {
      await playVoiceOutput(audioData, { 
        signal: controller.signal,
        volume: options.volume ?? 1.0 
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof AudioError) throw error;
    logger.error('Error playing audio:', error);
    throw new AudioError('Failed to play audio output', 'PLAYBACK_ERROR');
  }
} 