/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import MicrophoneStream from 'microphone-stream';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@translate-voice/context';
import { Buffer } from 'buffer';

interface MicStream extends MicrophoneStream {
  on: (data: string, fn: (chunk: Buffer) => void) => void;
}

interface TranscriptionData {
  results: [
    {
      alternatives: [
        {
          transcript: string;
        },
      ];
    },
  ];
}

const floatTo16BitPCM = (input: Float32Array, output: Int16Array) => {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
};

let microphoneStream: MicStream | undefined;
let socket: Socket;

export const useMicrophoneStream = () => {
  const [isError, setError] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState<string>();
  const [targetLanguage, setTargetLanguage] = useState<string>();
  const [transcription, setTranscription] = useState<string>();
  const [translation, setTranslation] = useState<string>();
  const [audioOutput, setAudioOutput] = useState<string>();

  const { accessToken } = useAuth();

  const startRecording = async (sourceLanguage: string, targetLanguage: string) => {
    setError(false);
    setTranscription(undefined);
    setTranslation(undefined);
    setAudioOutput(undefined);
    setSourceLanguage(sourceLanguage);
    setTargetLanguage(targetLanguage);

    window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      microphoneStream = new MicrophoneStream() as MicStream;
      microphoneStream.setStream(stream);

      socket = io('https://translate-stream-service-ocrtlpqp4q-uk.a.run.app', {
        // socket = io('http://localhost:8000', {
        query: { sourceLang: sourceLanguage, targetLang: targetLanguage },
        auth: {
          token: accessToken,
        },
      });

      socket.on('connect_error', (err) => {
        console.error(err.message);
      });

      socket.on('transcriptionData', (data: unknown) => {
        const transcriptionData = data as TranscriptionData;
        setTranscription(transcriptionData.results[0].alternatives[0].transcript);
      });

      socket.on('translationData', (data: unknown) => {
        setTranslation(data as string);
      });

      socket.on('disconnect', () => {
        if (microphoneStream) {
          microphoneStream.stop();
          microphoneStream = undefined;
        }
        setError(true);
      });

      microphoneStream &&
        microphoneStream.on('data', (chunk: Buffer) => {
          const raw = MicrophoneStream.toRaw(chunk);
          if (raw == null) {
            return;
          }
          const int16Array = new Int16Array(raw.length);
          floatTo16BitPCM(raw, int16Array);
          socket.emit('audioData', int16Array);
        });
    });
  };

  const stopRecording = async () => {
    if (microphoneStream) {
      microphoneStream.stop();
      microphoneStream = undefined;
    }
    if (socket && transcription && transcription.trim() !== '') {
      socket.emit('translate', {
        transcription,
      });
    } else {
      setTimeout(() => {
        socket.emit('emptyTranscription');
      }, 2000);
    }

    if (socket) {
      socket.on('audioFile', async (data) => {
        const buffer = Buffer.from(data);
        const base64 = buffer.toString('base64');
        setAudioOutput(base64);
        socket.close();
      });
    }
  };

  return {
    sourceLanguage,
    targetLanguage,
    transcription,
    translation,
    audioOutput,
    isError,
    startRecording,
    stopRecording,
  };
};
