/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage } from 'aws-amplify';
import awsConfig from '../../aws-exports';
import { Predictions } from '@aws-amplify/predictions';
import { getAccessToken } from '../auth/auth';
import { v4 as uuidv4 } from 'uuid';
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  TranscriptionJob,
  DeleteTranscriptionJobCommand,
} from '@aws-sdk/client-transcribe';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { PullQueue } from './utils';

export const transcribe = async (bytes: any, language: string) => {
  const response = await Predictions.convert({
    transcription: {
      source: {
        bytes,
      },
      language: language,
    },
  });
  return response.transcription.fullText;
};

const floatTo16BitPCM = (input: Float32Array, output: Int16Array) => {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
};

const writeWAV = (int16Array: Int16Array) => {
  const buffer = new ArrayBuffer(44 + int16Array.length * 2);
  const view = new DataView(buffer);

  function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  const numChannels = 1; // mono
  const sampleRate = 44100; // standard sample rate

  writeString(view, 0, 'RIFF'); // RIFF header
  view.setUint32(4, 32 + int16Array.length * 2, true); // size of the entire file
  writeString(view, 8, 'WAVE'); // WAVE format
  writeString(view, 12, 'fmt '); // format chunk
  view.setUint32(16, 16, true); // length of the format chunk
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true); // mono
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data'); // data chunk
  view.setUint32(40, int16Array.length * 2, true); // size of the data chunk

  // Write the PCM samples
  let offset = 44;
  for (let i = 0; i < int16Array.length; i++, offset += 2) {
    view.setInt16(offset, int16Array[i], true);
  }

  return view;
};

const saveWAV = async (wavDataView: DataView, filename: string) => {
  const blob = new Blob([wavDataView], { type: 'audio/wav' });
  const result = await Storage.put(filename, blob);
  return result.key;
};

export const transcribeUpload = async (bytes: Float32Array, language: string): Promise<string> => {
  const int16Array = new Int16Array(bytes.length);
  floatTo16BitPCM(bytes, int16Array);
  const wavDataView = writeWAV(int16Array);
  const filename = uuidv4();
  const key = await saveWAV(wavDataView, filename);

  const accessToken = await getAccessToken();
  if (accessToken) {
    const COGNITO_ID = `cognito-idp.${awsConfig.aws_cognito_region}.amazonaws.com/${awsConfig.aws_user_pools_id}`;
    const loginData = {
      [COGNITO_ID]: accessToken,
    };
    const transcribeClient = new TranscribeClient({
      region: awsConfig.predictions.convert.transcription.region,
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: awsConfig.aws_cognito_region }),
        identityPoolId: awsConfig.aws_cognito_identity_pool_id,
        logins: loginData,
      }),
    });
    const startJobCommand = new StartTranscriptionJobCommand({
      TranscriptionJobName: key,
      LanguageCode: language,
      Media: {
        MediaFileUri: `s3://${awsConfig.aws_user_files_s3_bucket}/public/${key}`,
      },
      OutputBucketName: awsConfig.aws_user_files_s3_bucket,
      OutputKey: 'public/',
    });
    await transcribeClient.send(startJobCommand);
    const getJobCommand = new GetTranscriptionJobCommand({
      TranscriptionJobName: key,
    });
    const queue = new PullQueue({
      interval: 500,
      maxRetries: 30,
    });

    const queueResponse = (await queue.pushJob(async () => {
      const response = await transcribeClient.send(getJobCommand);
      if (
        response.TranscriptionJob?.TranscriptionJobStatus === 'FAILED' ||
        response.TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED'
      ) {
        return response.TranscriptionJob;
      } else {
        throw new Error('Error getting job result...');
      }
    })) as TranscriptionJob;

    const url = queueResponse.Transcript?.TranscriptFileUri;
    if (url) {
      const urlArr = url?.split('/');
      const output = urlArr[urlArr.length - 1];
      const result = await Storage.get(output, { download: true });
      if (result.Body) {
        const resultText = await result.Body.text();
        const resultJson = JSON.parse(resultText);
        if (resultJson?.results?.transcripts) {
          let outputString = '';
          resultJson.results.transcripts.forEach((item: any) => {
            outputString = outputString + ' ' + item.transcript;
          });

          // Delete resources async
          const removeJobCommand = new DeleteTranscriptionJobCommand({
            TranscriptionJobName: key,
          });
          transcribeClient.send(removeJobCommand);
          Storage.remove(key);
          Storage.remove(output);

          return outputString || '';
        }
      }
    }
  }
  return '';
};
