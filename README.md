# Merkle Airdrop Contract

This project implements a secure and gas-efficient Merkle Airdrop smart contract that distributes ERC20 tokens to eligible recipients using a Merkle tree structure for verification.

## Features

- Efficient token distribution using Merkle proofs
- Users claim tokens by submitting a valid Merkle proof
- Prevents double claims with on-chain tracking
- Configurable Merkle root by the contract owner
- Ideal for airdrops, rewards, or whitelist distributions

## Prerequisites

- Node.js (v20+ recommended)
- npm or yarn
- Hardhat
- MetaMask wallet

## Setup

1. Clone the repository:

   ```shell
   git clone https://github.com/michojekunle/merklr-tree-airdrop/tree/rsk-article.git
   ```
2. Install dependencies

   ```shell
   cd merklr-tree-aidrop
   npm install
   ```
3. Add your environment variables create a new file `.env` and add the following

   ```bash
   WALLET_KEY=your-private-key
   CLAIMER_KEY=claimer-private-key
   ROOTSTOCK_TESTNET_RPC_URL=your-alchemy-rpc-testnet-url
   ```
4. Compile, test, and deploy contract

   ```shell
   npx hardhat compile
   npx hardhat test
   npx hardhat ignition deploy ./ignition/modules/MerkleAirdrop.js --network rootstock
   ```