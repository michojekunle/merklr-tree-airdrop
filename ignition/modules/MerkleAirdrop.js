
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const merkle_root_hash =  "0x6b59dc540e70072fc9fc969ac39da856e76128f0a5f414f71081d2031fdd0153";
const token_address = "0x072D37C74404d375Fa8B069C8aF50C0950DbF351";

module.exports = buildModule("MerkleAirdropModule", (m) => {

  const MerkleAirdrop = m.contract("MerkleAirdrop", [token_address, merkle_root_hash]);

  return { MerkleAirdrop };
});
