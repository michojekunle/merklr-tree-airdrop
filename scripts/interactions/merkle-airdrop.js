const { ethers } = require("hardhat");

async function main() {
    // const merkle_root_hash = "0x6b59dc540e70072fc9fc969ac39da856e76128f0a5f414f71081d2031fdd0153";
    
    const web3CXITokenAddress = "0x072D37C74404d375Fa8B069C8aF50C0950DbF351";
    const web3CXI = await ethers.getContractAt("IERC20", web3CXITokenAddress);
  
    const merkleAirdrop = await ethers.getContractAt("IMerkleAirdrop", "0x9e1334162C64A1fA4C6d25Bf4746492Aa45a88d9");


    // approve contract from token to deposit into contract 
    const approveAmount = ethers.parseUnits("100", 18);
    const approveTx = await web3CXI.approve(merkleAirdrop, approveAmount);
    await approveTx.wait();

    // // interact with depositIntoContract Function 
    // const amountToDeposit = ethers.parseUnits("100", 18);
    // const depositIntoContractTx = await merkleAirdrop.depositIntoContract(amountToDeposit);
    // // console.log(depositIntoContractTx);
    // await depositIntoContractTx.wait();

    //interact with the claimReward Function
    const amountToClaim = 50;
    const merkleProof = [
        "0x44bc5d1aeabe6110d1b6f0e45bda9c6b5e2c85f8936334ec2a38b8b1dea8d6e1",
        "0xa8a97b8e79914a47de2635628300ef117c96a633a49773d98c8893b4eb6fe0e0",
        "0xf4d97852be3f30a7e07f7135d203698adcab1cd1108f1b40010ce41f0cf3f377"
      ];
    const claimRewardTx = await merkleAirdrop.connect().claimReward(amountToClaim, merkleProof);

    console.log(claimRewardTx)
    await claimRewardTx.wait();
    console.log(claimRewardTx);

    // const 



}

main().catch((error) => {
    console.log("An error occured", error);
});

