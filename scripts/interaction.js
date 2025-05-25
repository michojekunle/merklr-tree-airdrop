const { ethers } = require("hardhat");

async function main() {
    const [ , claimer ] = await ethers.getSigners();
    const airdropTokenAddress = "0xf52C6787C8BCB577ffda524A694B862cBf6808B1";
    const airdropToken = await ethers.getContractAt("IERC20", airdropTokenAddress);
  
    const merkleAirdrop = await ethers.getContractAt("IMerkleAirdrop", "0x5e78a6d0A4933bF30bdA202F2Bd9a93685C40372");

    // approve contract from token to deposit into contract 
    const approveAmount = ethers.parseUnits("1000", 18);
    
    const approveTx = await airdropToken.approve(merkleAirdrop, approveAmount);
    console.log("⏳ Approve token transaction processing...")

    await approveTx.wait();
    console.log("✅ Approve token transaction success")

    // interact with depositIntoContract Function 
    const amountToDeposit = ethers.parseUnits("1000", 18);

    const depositIntoContractTx = await merkleAirdrop.depositIntoContract(amountToDeposit);
    console.log("⏳ Deposit token transaction processing...")

    await depositIntoContractTx.wait();
    console.log("✅ Deposit token transaction success")

    //interact with the claimReward Function
    const amountToClaim = 50;
    const merkleProof = [
      "0x50d292b5d19bd74109e7ecf7d53c31562ea5a8adfc15b8709244938ca076bdab",
      "0xfc10c97e7841c2585c296170e3d208f5c6e4ef5bb022e9e8ec941c30496bfa79",
      "0xcbc472afc87992f011c7e10092beb8c40dfb4e10fc99974bd333e421caf2cb19"
    ];

    const claimRewardTx = await merkleAirdrop.connect(claimer).claimReward(amountToClaim, merkleProof);
    console.log("⏳ Claim transaction processing")
    await claimRewardTx.wait();

    console.log("✅ Claim transaction success")
}

main().catch((error) => {
    console.log("An error occured", error);
});
