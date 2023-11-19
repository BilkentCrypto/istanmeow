import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'next-themes';

import '../styles/globals.css';
import { Web3Modal } from "../context/Web3Modal";

export const metadata = {
  title: "Web3Modal",
  description: "Web3Modal Example",
};

function zkHub({ Component, pageProps }) {

  const queryClientRef = React.useRef();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ThemeProvider attribute="class">
        <Web3Modal>
          <Component {...pageProps} />
        </Web3Modal>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default zkHub;
