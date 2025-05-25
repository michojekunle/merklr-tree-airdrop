// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMerkleAirdrop {
    function depositIntoContract(uint256 _amount) external;

    function UpdateMerkleRoot(bytes32 _new_merkle_root) external;

    function WithdrawRemainingTokens() external;

    function claimReward(
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external;
}