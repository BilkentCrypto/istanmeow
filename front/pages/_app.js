import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'next-themes';

import '../styles/globals.css';

function NftQ({ Component, pageProps }) {
  const queryClientRef = React.useRef();

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default NftQ;
