import { createContext } from 'react';
import useMM from '../hooks/mm';

export const MMContext = createContext(null);

export const MMProvider = ({ children, address }) => {
  const value = useMM({
    address,
  });

  return <MMContext.Provider value={value}>{children}</MMContext.Provider>;
};
