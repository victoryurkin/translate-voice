// import googleSpeech from '@google-cloud/speech';
import {
  getAuth,
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

export const google = () => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const accessToken = await user.getIdToken();
      console.log(accessToken);
    }
  });

  // Signin
  // signInWithEmailAndPassword(auth, 'victor.yurkin@gmail.com', '86V89y12g')
  //   .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     console.log(user);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // Signup
  // createUserWithEmailAndPassword(auth, 'victor.yurkin@gmail.com', '86V89y12g')
  //   .then((userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     console.log(user);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  // const client = new googleSpeech.SpeechClient({
  //   auth: {
  //     jsonContent: {},
  //   },
  // });
  // client
  //   .streamingRecognize({
  //     config: {
  //       encoding: 'LINEAR16',
  //       sampleRateHertz: 44100,
  //       languageCode: 'ru-RU',
  //     },
  //     interimResults: false, // If you want interim results, set this to true
  //   })
  //   .on('data', (data) => {
  //     console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);
  //   })
  //   .on('error', console.error);
  // googleAudio.create;
};
