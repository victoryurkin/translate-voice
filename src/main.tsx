import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './middleware/app.tsx';
import '@translate-voice/design-tokens';
import './index.css';

import { Amplify } from 'aws-amplify';
import { Predictions, AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
Predictions.addPluggable(new AmazonAIPredictionsProvider());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
