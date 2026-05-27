import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useAuthStore } from '@/lib/authStore';
import '@/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Load auth from storage on app init
    useAuthStore.getState().loadFromStorage();
  }, []);

  return <Component {...pageProps} />;
}
