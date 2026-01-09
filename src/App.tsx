import { usePrivy, useSolanaWallets } from '@privy-io/react-auth';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from '@solana/web3.js';
import { useState, useEffect, useCallback } from 'react';

interface AppProps {
  customRpcUrl: string;
}

function App({ customRpcUrl }: AppProps) {
  const { login, logout, authenticated, ready } = usePrivy();
  const { wallets, createWallet } = useSolanaWallets();
  const [loading, setLoading] = useState(false);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (solanaWallet) {
      navigator.clipboard.writeText(solanaWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const solanaWallet = wallets[0];
  const connection = new Connection(customRpcUrl);

  // Auto-create Solana wallet
  const handleCreateWallet = useCallback(async () => {
    if (authenticated && !solanaWallet && !creatingWallet) {
      setCreatingWallet(true);
      try {
        await createWallet();
      } catch (error) {
        console.error('Error creating wallet:', error);
      } finally {
        setCreatingWallet(false);
      }
    }
  }, [authenticated, solanaWallet, creatingWallet, createWallet]);

  useEffect(() => {
    handleCreateWallet();
  }, [handleCreateWallet]);

  // Send transaction
  const sendTransaction = async () => {
    if (!solanaWallet) return;

    setLoading(true);
    setTxSignature(null);

    try {
      const pubkey = new PublicKey(solanaWallet.address);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: pubkey,
          toPubkey: pubkey,
          lamports: 0.001 * LAMPORTS_PER_SOL,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = pubkey;

      const signature = await solanaWallet.sendTransaction!(transaction, connection);
      setTxSignature(signature);
    } catch (error) {
      console.error('Transaction error:', error);
      alert(`Transaction failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-brand">
          <img src="https://gorbagana.wtf/images/GOR-HD.avif" alt="Gorbagana" className="nav-logo" />
          Gorbagana
        </div>
        <div className="nav-wallet">
          {!authenticated ? (
            <button className="btn btn-primary btn-sm" onClick={login}>
              Connect
            </button>
          ) : creatingWallet ? (
            <span className="wallet-addr">Creating Wallet...</span>
          ) : !solanaWallet ? (
            <button className="btn btn-primary btn-sm" onClick={handleCreateWallet}>
              Create Wallet
            </button>
          ) : (
            <div className="wallet-dropdown">
              <button className="wallet-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <span className="wallet-indicator"></span>
                <span className="wallet-addr">{solanaWallet.address.slice(0, 4)}...{solanaWallet.address.slice(-4)}</span>
                <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">
                    <span className="label">Wallet Address</span>
                    <code className="full-address">{solanaWallet.address}</code>
                  </div>
                  <button className="dropdown-item copy-btn" onClick={copyAddress}>
                    {copied ? '✅ Copied!' : '📋 Copy Address'}
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={logout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="main">
        <div className="card">
          <h1>Hello! 👋</h1>
          <p>RPC: <code>{customRpcUrl}</code></p>
        </div>

        {authenticated && solanaWallet && (
          <div className="card">
            <h3>Send Transaction</h3>
            <button
              className="btn btn-primary"
              onClick={sendTransaction}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send 0.001 SOL'}
            </button>
            {txSignature && (
              <div className="tx-result">
                <strong>✅ Signature:</strong>
                <code>{txSignature}</code>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
