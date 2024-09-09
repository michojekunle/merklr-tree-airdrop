import { ethers } from "hardhat";

async function main() {
    const token = "0x072D37C74404d375Fa8B069C8aF50C0950DbF351";
    // const merkle_root_hash = "0x6b59dc540e70072fc9fc969ac39da856e76128f0a5f414f71081d2031fdd0153";
  
    const merkleAirdrop = await ethers.getContractAt("IMerkleAirdrop", "0x9e1334162C64A1fA4C6d25Bf4746492Aa45a88d9");

    // interact with depositIntoContract Function 
    const amountToDeposit = ethers.parseUnits("100", 18);

    //interact with the claimReward Function
    const withdrawAmount = 100;


}

main.catch((error) => {
    console.log("An error occured", error);
});

