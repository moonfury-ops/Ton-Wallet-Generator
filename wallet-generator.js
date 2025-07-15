const { mnemonicNew, mnemonicToWalletKey } = require('@ton/crypto');
const { WalletContractV4, WalletContractV3R2, Address } = require('@ton/ton');

class TONWalletGenerator {
    constructor() {
        this.defaultSubwalletId = 698983191; // Default subwallet ID from TON docs
        this.supportedVersions = ['v3r2', 'v4r2'];
    }

    /**
     * Validate input parameters
     * @param {string} version - Wallet version
     * @param {number} workchain - Workchain ID
     * @param {number} subwalletId - Subwallet ID
     */
    validateInputs(version, workchain, subwalletId) {
        if (!this.supportedVersions.includes(version.toLowerCase())) {
            throw new Error(`Unsupported wallet version: ${version}. Supported versions: ${this.supportedVersions.join(', ')}`);
        }
        
        if (workchain !== 0 && workchain !== -1) {
            throw new Error('Workchain must be 0 (basechain) or -1 (masterchain)');
        }
        
        if (subwalletId !== null && (!Number.isInteger(subwalletId) || subwalletId < 0)) {
            throw new Error('Subwallet ID must be a non-negative integer');
        }
    }

    /**
     * Generate a new wallet with mnemonic phrase
     * @param {string} version - Wallet version ('v3r2' or 'v4r2')
     * @param {number} workchain - Workchain ID (0 for basechain, -1 for masterchain)
     * @param {number} subwalletId - Subwallet ID for creating multiple wallets with same key
     * @returns {Promise<Object>} Wallet data including mnemonic, keys, and address
     */
    async generateWallet(version = 'v4r2', workchain = 0, subwalletId = null) {
        try {
            // Validate inputs
            this.validateInputs(version, workchain, subwalletId);
            
            console.log('Generating new TON wallet...');
            
            // Step 1: Generate mnemonic phrase (24 words)
            const mnemonic = await mnemonicNew(24);
            console.log('Mnemonic phrase generated');
            
            // Step 2: Derive key pair from mnemonic
            const keyPair = await mnemonicToWalletKey(mnemonic);
            console.log('Key pair derived');
            
            // Step 3: Create wallet contract based on version
            let wallet;
            const actualSubwalletId = subwalletId || this.defaultSubwalletId;
            
            switch (version.toLowerCase()) {
                case 'v3r2':
                    wallet = WalletContractV3R2.create({
                        workchain,
                        publicKey: keyPair.publicKey,
                        walletId: actualSubwalletId
                    });
                    break;
                case 'v4r2':
                default:
                    wallet = WalletContractV4.create({
                        workchain,
                        publicKey: keyPair.publicKey,
                        walletId: actualSubwalletId
                    });
                    break;
            }

            // Step 4: Get wallet address
            const address = wallet.address;
            console.log('Wallet contract created');

            const walletData = {
                mnemonic: mnemonic,
                mnemonicString: mnemonic.join(' '),
                publicKey: keyPair.publicKey.toString('hex'),
                secretKey: keyPair.secretKey.toString('hex'),
                address: {
                    raw: address.toRawString(),
                    bounceable: address.toString({ bounceable: true }),
                    nonBounceable: address.toString({ bounceable: false }),
                    urlSafe: address.toString({ urlSafe: true, bounceable: true })
                },
                walletVersion: version,
                workchain: workchain,
                subwalletId: actualSubwalletId,
                wallet: wallet
            };

            console.log('Wallet generated successfully!\n');
            return walletData;
        } catch (error) {
            console.error('Error generating wallet:', error.message);
            throw new Error(`Failed to generate wallet: ${error.message}`);
        }
    }

    /**
     * Generate and display a single wallet with formatted output
     */
    async generateAndDisplayWallet(version = 'v4r2', workchain = 0, subwalletId = null) {
        try {
            const wallet = await this.generateWallet(version, workchain, subwalletId);

            console.log('TON WALLET GENERATED');
            console.log(`Version: ${wallet.walletVersion.toUpperCase()}`);
            console.log(`Workchain: ${wallet.workchain}`);
            console.log(`Subwallet ID: ${wallet.subwalletId}`);
            console.log('\nMNEMONIC PHRASE (KEEP SECURE):');
            console.log(`"${wallet.mnemonicString}"`);
            console.log('\nKEYS:');
            console.log(`Public Key: ${wallet.publicKey}`);
            console.log(`Secret Key: ${wallet.secretKey}`);
            console.log('\nADDRESSES:');
            console.log(`Raw: ${wallet.address.raw}`);
            console.log(`Bounceable: ${wallet.address.bounceable}`);
            console.log(`Non-Bounceable: ${wallet.address.nonBounceable}`);
            console.log(`URL Safe: ${wallet.address.urlSafe}`);
            
            return wallet;
        } catch (error) {
            console.error('Failed to generate and display wallet:', error.message);
            throw error;
        }
    }
}

/**
 * Example usage and CLI interface
 */
async function examples() {
    const generator = new TONWalletGenerator();
    
    try {
        // Generate a single v4r2 wallet (default)
        console.log('Generating V4R2 wallet...\n');
        await generator.generateAndDisplayWallet();
        
    } catch (error) {
        console.error('Example failed:', error.message);
    }
}

// Export the class
module.exports = { TONWalletGenerator };

// Run examples if this file is executed directly
if (require.main === module) {
    examples().catch(console.error);
} 