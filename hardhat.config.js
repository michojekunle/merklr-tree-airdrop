require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    // for testnet
    rootstock: {
      url: process.env.ROOTSTOCK_TESTNET_RPC_URL,
      accounts: [process.env.WALLET_KEY, process.env.CLAIMER_KEY],
    },
  },
  etherscan: {
    // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
    apiKey: {
      rootstock: "123",
    },
    customChains: [
      {
        network: "rootstock",
        chainId: 31,
        urls: {
          apiURL: "https://rootstock-testnet.blockscout.com/api/",
          browserURL: "https://rootstock-testnet.blockscout.com/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};