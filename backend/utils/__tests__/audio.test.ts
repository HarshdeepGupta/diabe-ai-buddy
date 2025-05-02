// import { 
//   transcribeAudioInput, 
//   textToSpeech, 
//   recordVoice, 
//   playAudio,
//   AudioOptions,
//   AudioError
// } from '../audio';

// // Mock dependencies
// jest.mock('openai', () => ({
//   OpenAI: jest.fn().mockImplementation(() => ({
//     audio: {
//       transcriptions: {
//         create: jest.fn().mockResolvedValue('transcribed text')
//       }
//     }
//   }))
// }));

// jest.mock('@langchain/io', () => ({
//   recordVoiceInput: jest.fn().mockResolvedValue(Buffer.from('mock audio data')),
//   playVoiceOutput: jest.fn().mockResolvedValue(undefined)
// }));

// // Mock fetch for OpenTTS
// global.fetch = jest.fn().mockImplementation(() =>
//   Promise.resolve({
//     ok: true,
//     arrayBuffer: () => Promise.resolve(new ArrayBuffer(8))
//   })
// );

// describe('Audio Utilities', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('transcribeAudioInput', () => {
//     it('should transcribe audio successfully', async () => {
//       const audioData = Buffer.from('mock audio data');
//       const result = await transcribeAudioInput(audioData);
//       expect(result).toBe('transcribed text');
//     });

//     it('should handle cancellation', async () => {
//       const audioData = Buffer.from('mock audio data');
//       const controller = new AbortController();
//       controller.abort();
      
//       await expect(transcribeAudioInput(audioData, { cancelSignal: controller.signal }))
//         .rejects
//         .toThrow(AudioError);
//     });

//     it('should handle timeout', async () => {
//       const audioData = Buffer.from('mock audio data');
//       const openai = require('openai');
//       openai.OpenAI.mockImplementationOnce(() => ({
//         audio: {
//           transcriptions: {
//             create: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 2000)))
//           }
//         }
//       }));

//       await expect(transcribeAudioInput(audioData, { timeout: 1 }))
//         .rejects
//         .toThrow(AudioError);
//     });
//   });

//   describe('textToSpeech', () => {
//     it('should convert text to speech successfully', async () => {
//       const text = 'Hello world';
//       const result = await textToSpeech(text);
//       expect(result).toBeInstanceOf(Buffer);
//       expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/tts'), expect.any(Object));
//     });

//     it('should use custom voice and language', async () => {
//       const text = 'Hello world';
//       const options: AudioOptions = {
//         voice: 'custom_voice',
//         language: 'fr'
//       };
      
//       await textToSpeech(text, options);
//       expect(fetch).toHaveBeenCalledWith(
//         expect.any(String),
//         expect.objectContaining({
//           body: expect.stringContaining('"voice":"custom_voice"')
//         })
//       );
//     });

//     it('should handle API errors', async () => {
//       global.fetch = jest.fn().mockImplementationOnce(() =>
//         Promise.resolve({
//           ok: false,
//           statusText: 'Internal Server Error'
//         })
//       );

//       await expect(textToSpeech('test'))
//         .rejects
//         .toThrow(AudioError);
//     });
//   });

//   describe('recordVoice', () => {
//     it('should record voice successfully', async () => {
//       const result = await recordVoice(5);
//       expect(result).toBeInstanceOf(Buffer);
//     });

//     it('should use custom duration', async () => {
//       const duration = 10;
//       await recordVoice(duration);
//       expect(require('@langchain/io').recordVoiceInput)
//         .toHaveBeenCalledWith(duration, expect.any(Object));
//     });

//     it('should handle cancellation', async () => {
//       const controller = new AbortController();
//       controller.abort();
      
//       await expect(recordVoice(5, { cancelSignal: controller.signal }))
//         .rejects
//         .toThrow(AudioError);
//     });
//   });

//   describe('playAudio', () => {
//     it('should play audio successfully', async () => {
//       const audioData = Buffer.from('mock audio data');
//       await playAudio(audioData);
//       expect(require('@langchain/io').playVoiceOutput)
//         .toHaveBeenCalledWith(audioData, expect.any(Object));
//     });

//     it('should use custom volume', async () => {
//       const audioData = Buffer.from('mock audio data');
//       const volume = 0.5;
//       await playAudio(audioData, { volume });
//       expect(require('@langchain/io').playVoiceOutput)
//         .toHaveBeenCalledWith(
//           audioData,
//           expect.objectContaining({ volume })
//         );
//     });

//     it('should handle cancellation', async () => {
//       const audioData = Buffer.from('mock audio data');
//       const controller = new AbortController();
//       controller.abort();
      
//       await expect(playAudio(audioData, { cancelSignal: controller.signal }))
//         .rejects
//         .toThrow(AudioError);
//     });
//   });
// }); 