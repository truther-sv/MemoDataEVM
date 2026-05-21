# Token Transaction with Memo

This project is designed to teach how to send additional data (MEMO) along with a USDT (Tether) token transaction on a EVM-compatible network. The additional data can include various types of information such as a key, and an optional refund address.

## Overview

The script utilizes the `ethers.js` library to interact with the blockchain and the USDT token contract. It also uses `axios` to fetch the current gas price and `dotenv` to manage environment variables. The goal is to send a transaction with additional data encoded in the transaction's input data field.

## Features

- **Send USDT Transactions**: Execute token transfers with additional memo data.
- **Custom Memo Data**: Include a key, and an optional refund address.
- **Dynamic Gas Price Calculation**: Fetches current gas prices and adjusts for faster transaction speeds.

## Requirements

- Node.js
- `ethers.js`
- `axios`
- `dotenv`
- `abi-decoder`

## Setup

1. **Clone the Repository**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    Create a `.env` file in the project root and add the following environment variables:

    ```dotenv
    NODE_URL=<your-json-rpc-provider-url>
    CHAIN_ID=<chain-id>
    TOKEN_CONTRACT_ADDRESS=<token-contract-address>
    W_KEY=<your-wallet-private-key>
    SCAN_API_KEY=<your-etherscan-api-key>
    ```

    We use a default public RPC: https://polygon-rpc.com, chain id: 137, and token contract address: 0xc2132D05D31c914a87C6611C10748AEb04B58e8F (Polygon USDT), for Polygon, and https://rpc.plasma.to, chain id: 9745, and token contract address: 0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb (Plasma USDT), for Plasma.
    You can get a free etherscan key and check the chain id on https://etherscan.com

4. **Prepare ABI File**

    Ensure the `usdt.json` ABI file is available in the project root directory. This file contains the ABI of the USDT token contract.

## Usage

Edit the `messageOffRamp` and `amount` variables in the script to specify the memo data and transaction amount:

```javascript
const messageOffRamp = "<your--key>|refund:<refund--address>";

const amount = "<transaction-amount-in-ether>";

getMemoAndSendTransactions(messageOffRamp, amount, recipientEngine);
```


## Memo Data Format

- **Key**: A random key provided by the bank. Example: `6602ede6-b1a9-4e63-9178-c6883fd0095e`
- **Phone Number**: International format with country code, city code, and 9 digits. Example: `+5548996005588`
- **CPF**: 11 digits without spaces or special characters. Example: `80042387413`
- **CNPJ**: 14 digits without spaces or special characters. Example: `59456277000176`
- **Email**: Example: `john@gmail.com`
- **Refund Address (Optional)**: The address where the refund will be sent if the transaction fails: Example: `0x123...`

## Notes

- The memo should be sent encrypted to protect privacy, the code provides an endpoint with a pattern encryption method and so it can be recognized by our engine.
- The optional Refund Address parameter can be used to specify where funds should be returned if the transaction cannot be processed.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [ethers.js](https://docs.ethers.io/)
- [etherscan](https://etherscan.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [axios](https://axios-http.com/)
- [abi-decoder](https://www.npmjs.com/package/abi-decoder)
