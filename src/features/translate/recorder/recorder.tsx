/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Predictions } from '@aws-amplify/predictions';
import mic from 'microphone-stream';

interface MicStream extends mic {
  on: (data: string, fn: (chunk: any) => void) => void;
}

export const useRecorder = () => {
  const [language, setLanguage] = useState<string>();
  const [micStream, setMicStream] = useState<mic | null>();
  const [audioBuffer] = useState(
    (function () {
      let buffer: any = [];
      function add(raw: any) {
        buffer = buffer.concat(...raw);
        return buffer;
      }
      function newBuffer() {
        buffer = [];
      }

      return {
        reset: function () {
          newBuffer();
        },
        addData: function (raw: any) {
          return add(raw);
        },
        getData: function () {
          return buffer;
        },
      };
    })()
  );

  const convertFromBuffer = async (bytes: any) => {
    return Predictions.convert({
      transcription: {
        source: {
          bytes,
        },
        language: language || 'en-US',
        // language: "en-US", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
      },
    });
  };

  const startRecording = async (language = 'en-US') => {
    setLanguage(language);
    audioBuffer.reset();

    window.navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      const startMic = new mic();

      startMic.setStream(stream);

      const micStream = startMic as MicStream;
      micStream.on('data', (chunk: any) => {
        const raw = mic.toRaw(chunk);
        if (raw == null) {
          return;
        }
        audioBuffer.addData(raw);
      });

      setMicStream(startMic);
    });
  };

  const stopRecording = async () => {
    if (micStream) {
      micStream.stop();
      setMicStream(null);
    }

    const resultBuffer = audioBuffer.getData() as any;
    const response = await convertFromBuffer(resultBuffer);
    setLanguage(undefined);
    return response.transcription.fullText;
  };

  return {
    startRecording,
    stopRecording,
  };
};
