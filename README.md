# TON Wallet Generator

A comprehensive Node.js library for generating TON (The Open Network) blockchain wallets based on the official TON documentation.

## Features

- Generate new wallets with 24-word mnemonic phrases
- Restore wallets from existing mnemonic phrases
- Support for Wallet V3R2 and V4R2 versions
- Generate multiple wallets with the same mnemonic using different subwallet IDs
- Address validation
- Multiple address formats (bounceable, non-bounceable, URL-safe)
- State initialization data for wallet deployment
- Based on official TON SDK (@ton/ton, @ton/core, @ton/crypto)

## Installation

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn

### Setup

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

## Quick Start

### Basic Usage

```javascript
const { TONWalletGenerator } = require('./wallet-generator');

async function example() {
    const generator = new TONWalletGenerator();
    
    // Generate a new V4R2 wallet
    const wallet = await generator.generateWallet('v4r2');
    
    console.log('Mnemonic:', wallet.mnemonicString);
    console.log('Address:', wallet.address.bounceable);
    console.log('Public Key:', wallet.publicKey);
}

example();
```

### Running Examples

```bash
# Run the built-in examples
npm start

# Run comprehensive tests
npm test
```