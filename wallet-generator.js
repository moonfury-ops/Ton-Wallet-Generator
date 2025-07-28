import { mnemonicNew, mnemonicToPrivateKey } from 'ton-crypto';
import TonWeb from 'tonweb';

const tonWeb = new TonWeb();

const generateWallet = async () => {
    const mnemonics = await mnemonicNew();
    const keyPair = await mnemonicToPrivateKey(mnemonics);
    const publicKey = keyPair.publicKey;
    const secretKey = keyPair.secretKey;
    const wallet = tonWeb.wallet.create({publicKey: publicKey, version: 'v1R2'});
    const walletAddress = (await wallet.getAddress()).toString(true, true, true);

    console.log("Mnemonic:", mnemonics.join(' '));
    console.log("Public Key:", Buffer.from(publicKey).toString('hex'));
    console.log("Secret Key:", Buffer.from(secretKey).toString('hex'));
    console.log("Wallet Address:", walletAddress);
}

generateWallet();