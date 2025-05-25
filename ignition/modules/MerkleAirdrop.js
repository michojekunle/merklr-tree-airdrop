const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const merkle_root_hash =  "0xf09b25d8e5f728d4bab7ac3ca84a016e06c74b7fa54923fa47e2b3d7240cc4fd";
const token_address = "0xf52C6787C8BCB577ffda524A694B862cBf6808B1"; // paste your token contract here

module.exports = buildModule("MerkleAirdropModule", (m) => {

  const MerkleAirdrop = m.contract("MerkleAirdrop", [token_address, merkle_root_hash]);

  return { MerkleAirdrop };
});