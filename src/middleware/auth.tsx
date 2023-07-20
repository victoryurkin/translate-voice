import { Router } from '../pages/router';
import { BrowserRouter } from 'react-router-dom';

const Auth = () => {
  return (
    <div className="h-full">
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </div>
  );
};

export default Auth;
