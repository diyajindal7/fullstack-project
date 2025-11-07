import { useContext } from 'react';
// We will export 'AuthContext' in the next step
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
