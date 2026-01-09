# Gorbagana Privy Example

A minimal React example demonstrating Privy wallet integration with a custom Solana RPC endpoint.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Add your Privy App ID to `.env` (get one free at [dashboard.privy.io](https://dashboard.privy.io))

4. Run the app:
```bash
npm run dev
```

## Configuration

This example uses Gorbagana's custom RPC endpoint (`https://rpc.gorbagana.wtf/`).

For custom SVM networks, transactions are sent by passing a custom `Connection` instance:

```typescript
// Initialize connection instance with custom SVM RPC URL
let connection = new Connection('insert-custom-SVM-rpc-url');

// Build out the transaction object for your desired program
// https://solana-foundation.github.io/solana-web3.js/classes/Transaction.html
let transaction = new Transaction();

// Send transaction on custom SVM
console.log(await wallet.sendTransaction!(transaction, connection));
```

## Note

During transaction signing, Privy's popup will display "Solana" as the network name. However, the transaction is sent to the Gorbagana SVM chain via the custom RPC endpoint. There is currently no way to change the network name in Privy's transaction popup for SVM chains.

## Documentation

- [Privy: Configuring Solana Networks](https://docs.privy.io/basics/react/advanced/configuring-solana-networks)
- [Privy: Custom SVM Networks](https://docs.privy.io/basics/react/advanced/configuring-solana-networks#custom-solana-virtual-machine-svm-networks)

## License

MIT
