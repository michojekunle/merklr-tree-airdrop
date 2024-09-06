# Merkle Tree Airdrop

This project consists of a Merkle-based token airdrop smart contract (`MerkleAirdrop`) and a JavaScript script (`merkle.js`) for generating the Merkle root and proofs from a list of eligible addresses. The following instructions will guide you through setting up the environment, deploying the contract, and generating proofs for claiming the airdrop.

## Table of Contents

1. [Setup and Running the `merkle.js` Script](#setup-and-running-the-merklejs-script)
2. [Testing](#testing)
3. [Deploying the `MerkleAirdrop`Contract](#deploying-the-merkleairdrop-contract)
4. [Generating Proofs for Claiming the Airdrop](#generating-proofs-for-claiming-the-airdrop)
5. [Assumptions and Limitations](#assumptions-and-limitations)

## Setup and Running the `merkle.js` Script

### Prerequisites

- Node.js installed on your machine.

- A package manager like npm or yarn.

- The Ethereum address list in a CSV file with the following format:

  ```
  address,amount 
  0xAbC123...,1000
  0xDef456...,2000`
  ```

### Setup

1. **Clone the repository:**

   ```
   git clone https://github.com/michojekunle/merklr-tree-airdrop.git cd merkl-tree-airdrop
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Set up the CSV file:**

   Place your CSV file (e.g., `airdrop.csv`) in the project root directory.

### Running the Script

1. **Generate the Merkle Root and Proofs:**

   Run the following command to generate the Merkle root and proof data:

   ```
   node scripts/merkle.js airdrop.csv
   ```

   This script will:

   - Read the CSV file.
   - Generate a Merkle tree from the addresses and amounts.
   - Output the Merkle root hash in your terminal where you ran the command and save the proof data for each address in a JSON file (e.g., `proofs.json`).

2. **Check the Output:**

   The script will output the Merkle root hash, which you'll use to deploy the smart contract. The proof data is saved in a JSON file and will be needed for users to claim their tokens.

## Testing

- Tests can be found in the test folder
- To test run the command: 

  ```
  npx hardhat test
  ```

## Deploying the `MerkleAirdrop` Contract

### Prerequisites

- An Ethereum development environment like Hardhat.
- An ERC-20 token contract deployed or an existing token contract address.
- A wallet with sufficient funds for deployment.

### Deployment Steps

1. **Set up your hardhat config and .env:** 

   - Make sure to have the necessary dependencies installed

   Note: This hardhat config has setup lisk-sepolia network only, you can add other networks if you want to deploy on them

   ```
   require("@nomicfoundation/hardhat-toolbox");
   const dotenv = require("dotenv");
   dotenv.config();
   
   /** @type import('hardhat/config').HardhatUserConfig */
   module.exports = {
     solidity: "0.8.24",
     networks: {
       // for testnet
       "lisk-sepolia": {
         url: "https://rpc.sepolia-api.lisk.com",
         accounts: [process.env.WALLET_KEY],
         gasPrice: 1000000000,
       },
     },
     etherscan: {
       // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
       apiKey: {
         "lisk-sepolia": "123",
       },
       customChains: [
         {
           network: "lisk-sepolia",
           chainId: 4202,
           urls: {
             apiURL: "https://sepolia-blockscout.lisk.com/api",
             browserURL: "https://sepolia-blockscout.lisk.com",
           },
         },
       ],
     },
     sourcify: {
       enabled: false,
     },
   };
   ```

  - set up your `.env`, in your `.env`

   ```
   WALLET_KEY=""
   ```
2. **Update the Deployment module:**

   Update your ignition modules (e.g., `ignition/modules/MerkleAirdrop.js`) with the following parameters:
   - `tokenAddress`: The address of the ERC-20 token.
   - `merkle_root_hash`: The Merkle root hash generated from the `merkle.js` script.

   Example:

   ```
   
   const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
   
   const merkle_root_hash =  "0xyour-merkle-root-hash";
   const token_address = "0xyourtokenaddress";
   
   module.exports = buildModule("MerkleAirdropModule", (m) => {
   
     const MerkleAirdrop = m.contract("MerkleAirdrop", [token_address, merkle_root_hash]);
   
     return { MerkleAirdrop };
   });
   ```
3. **Deploy the Contract:**

   Deploy the contract using Hardhat:

   ```
   npx hardhat ignition deploy ignition/modules/MerkleAirdrop.js --network lisk-sepolia
   ```

4. **Verify the Deployment:**

   Once deployed, note the contract address. You can verify the contract on Etherscan or blockscout if deployed in lisk-sepolia using:

   ```
   npx hardhat verify --network lisk-sepolia <your-contract-address> <...args>
   ```

- *Note: &lt;...args&gt; are the arguments passed to the constructor of your contract when it is being deployed*

## Generating Proofs for Claiming the Airdrop

### Prerequisites

- The `proofs.json` file generated by the `merkle.js` script.
- The deployed `MerkleAirdrop` contract address.

### Claiming Process

1. **Locate the Proof:**

   In the `proofs.json` file, find the proof associated with the address you want to claim tokens for. The file should look like this:

   ```
   {
       "0xAbC123...": {
           "proof": [
               "0xProofElement1",
               "0xProofElement2"
           ],
           "amount": 1000
       },
       ...
   }
   ```

2. **Claim Tokens:**

   Call the `claimReward` function on the `MerkleAirdrop` contract with the following parameters:

   - `_amount`: The amount of tokens to claim for the specific address (from `proofs.json`).
   - `_merkleProof`: The proof array for the specific address (from `proofs.json`).

   Example in JavaScript:

   ```
   await merkleAirdrop.claimReward(1000, [
       "0xProofElement1",
       "0xProofElement2"
   ]);
   ```

   This function will revert if the user is not eligible or has already claimed their tokens.

## Assumptions and Limitations

1. **CSV File Format:**

   - The script assumes a CSV file format with two columns: `address` and `amount`. Any deviation from this format will cause errors.

2. **ERC-20 Token Approval:**

   - The `MerkleAirdrop` contract must have an allowance set by the token owner to deposit tokens into the contract to distribute tokens to users. Ensure that the contract has been approved to transfer tokens on behalf of the owner before depositing into the contract.

3. **One-Time Claim:**

   - Users can only claim their airdrop once. The contract tracks whether an address has already claimed tokens.

4. **Gas Limitations:**

   - The size of the Merkle tree (i.e., the number of participants) can impact gas costs when claiming tokens. Test with different tree sizes to optimize for gas efficiency.

5. **Security Considerations:**

   - Ensure that the Merkle tree is generated securely and that the proofs are distributed to eligible users without leaks.
