import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
const abiDecoder = require('abi-decoder');

const recipientEngine = "0x32dE69fF5B049ba19a0268e3BB342C5a28464117";
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS as string;
const ERC20_ABIJSON = require('./usdt.json');

// Set the ABI for decoding transaction data
abiDecoder.addABI(ERC20_ABIJSON.abi);

async function getMemoAndSendTransactions(message: string, amountInEther: string, recipient: string) {

    try {

        const provider = new ethers.providers.JsonRpcProvider(process.env.NODE_URL);
        const pk = process.env.W_KEY ? process.env.W_KEY : "";
        // Wallet with private key
        const wallet = new ethers.Wallet(pk, provider);
        const usdtContractChecker = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, ERC20_ABIJSON.abi, wallet);

        const dataPost = {
            memo: message
        }

        // encrypt the memo first

        // https://hapi.rezolvepay.to/v1/application/encode-memo

        const encrypted = await axios.post("https://api.rezolvepay.to/v1/application/encode-memo", dataPost);

        if (encrypted?.status > 300) {
            throw new Error(`Error on encrypt API call. Status Code: ${encrypted?.status}`);
        }

        const dataField = ethers.utils.hexlify(
            ethers.utils.toUtf8Bytes(`MEMO:${encrypted?.data}`)
        );

        const amount = ethers.utils.parseUnits(String(amountInEther), Number(6));

        let iface = new ethers.utils.Interface(ERC20_ABIJSON.abi);

        const data =
            iface.encodeFunctionData('transfer', [
                recipient,
                amount
            ]) + dataField.replace('0x', '');

        const gasPrices = await axios.get(
            `https://api.etherscan.io/v2/api?chainid=${process.env.CHAIN_ID}&module=gastracker&action=gasoracle&apikey=${process.env.SCAN_API_KEY}`,
        );

        let fastGasPrice = parseFloat(gasPrices.data.result.FastGasPrice)
        fastGasPrice *= 2.15;
        let gasPrice = fastGasPrice.toFixed(1);

        const nonce = await provider.getTransactionCount(wallet.address, 'latest');

        // Craft transaction
        const tx = {
            to: TOKEN_CONTRACT_ADDRESS,
            value: 0,
            gasLimit: ethers.utils.hexlify(600000),
            gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
            nonce,
            data: data,
        };


        const send = await wallet.sendTransaction(tx);
        await send.wait();

        console.log('Transaction sent. Hash:', send.hash);

        //   }


    } catch (error: any) {
        console.error('Error 2:', error.message);
    }
}

// Get from form and send:

const messageOffRamp = "<your--key>|refund:<refund--address>|fpro:<fee--profile>";

const amount = "<transaction-amount-in-ether>";


getMemoAndSendTransactions(messageOffRamp, amount, recipientEngine);
