import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Default = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth');
  }, []);

  return null;
};
