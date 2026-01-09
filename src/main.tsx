import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';
import './App.css';

// Custom RPC URL for Gorbagana
const CUSTOM_RPC_URL = 'https://rpc.gorbagana.wtf/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID || 'cmk73q9i501qyl80c0v10qha2'}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#9945FF',
          logo: 'https://gorbagana.wtf/images/GOR-HD.avif',
        },
        loginMethods: ['email', 'wallet', 'google'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App customRpcUrl={CUSTOM_RPC_URL} />
    </PrivyProvider>
  </React.StrictMode>
);
