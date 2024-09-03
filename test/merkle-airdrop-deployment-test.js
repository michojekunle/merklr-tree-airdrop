const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("MerkleAirdrop", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployToken() {
    const erc20Token = await ethers.getContractFactory("Web3CXI");
    const token = await erc20Token.deploy();

    return { token };
  }

  async function deployMerkleAirdrop() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const { token } = await loadFixture(deployToken);
    const merkle_root_hash =
      "0x6b59dc540e70072fc9fc969ac39da856e76128f0a5f414f71081d2031fdd0153";

    const MerkleAirdrop = await ethers.getContractFactory("MerkleAirdrop");
    const merkleAirdrop = await MerkleAirdrop.deploy(token, merkle_root_hash);

    return { merkleAirdrop, owner, otherAccount, token, merkle_root_hash };
  }

  describe("deployment", function () {
    it("should check if owner and token address is set", async function () {
      const { merkleAirdrop, owner, token, merkle_root_hash } =
        await loadFixture(deployMerkleAirdrop);

      expect(await merkleAirdrop.owner()).to.equal(owner);
      expect(await merkleAirdrop.tokenAddress()).to.equal(token);
      expect(await merkleAirdrop.merkleRootHash()).to.equal(merkle_root_hash);
    });
  });
});
