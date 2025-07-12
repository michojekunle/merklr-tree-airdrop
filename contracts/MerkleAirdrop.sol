// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    using SafeERC20 for IERC20;

    // state variables
    bytes32 public merkleRootHash;
    address public owner;
    address public tokenAddress;

    // mappings -- to track users that have claimed tokens
    mapping(address => bool) usersClaimed;

    // constructor
    constructor(address _tokenAddress, bytes32 _merkleRootHash) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
        merkleRootHash = _merkleRootHash;
    }

    // errors
    error ZeroAmountNotAllowed();
    error UserAlreadyClaimed();
    error SorryYouAreNotEligible();
    error YouAreNotTheOwner();
    error InsufficientTokenAmountFromSender();
    error InsufficientFundsPleaseTryAgain();
    error NoTokensRemainingToWithdraw();

    // events
    event UserClaimedTokens(address indexed user, uint256 amount);
    event DepositIntoContractSuccessful(address indexed sender, uint256 amount);

    function depositIntoContract(uint256 _amount) external {
        // checks
        _onlyOwner();
        if (_amount <= 0) revert ZeroAmountNotAllowed();

        // get token balance of msg.sender -- to check if msg.sender has enogh tokens to deposit into contract
        uint256 _userTokenBalance = IERC20(tokenAddress).balanceOf(msg.sender);

        // revert if msg.sender doesn't have enought tokens to send
        if (_userTokenBalance < _amount)
            revert InsufficientTokenAmountFromSender();

        // deposit tokens into cotract from msg.sender
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), _amount);

        // emit deposit successfull event
        emit DepositIntoContractSuccessful(msg.sender, _amount);
    }

    function updateMerkleRoot(bytes32 _new_merkle_root) external {
        // checks
        _onlyOwner();

        // updates merkleRootHash
        merkleRootHash = _new_merkle_root;
    }

    function withdrawRemainingTokens() external {
        // checks only owner
        _onlyOwner();

        // check contract balance if less than zero revert
        uint256 _contractBalance = IERC20(tokenAddress).balanceOf(
            address(this)
        );
        if (_contractBalance <= 0) revert NoTokensRemainingToWithdraw();

        // withdraw remaining tokens to onwwers account
        IERC20(tokenAddress).safeTransfer(owner, _contractBalance);
    }

    function claimReward(
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external {
        // recreate leaf node from user address and amount
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));

        // verify that user us eligible using merkle proof
        if (!MerkleProof.verify(_merkleProof, merkleRootHash, leaf))
            revert SorryYouAreNotEligible();

        // check if user has claimed before
        if (usersClaimed[msg.sender]) revert UserAlreadyClaimed();

        // save claimed user
        usersClaimed[msg.sender] = true;

        // withdraw eligible amount to eligible user
        _withdraw(msg.sender, _amount);

        // emit events user claimed reward
        emit UserClaimedTokens(msg.sender, _amount);
    }

    function _withdraw(address _to, uint256 _amount) internal {
        // check if enough tokens is in contract else revert indufficient funds
        if (IERC20(tokenAddress).balanceOf(address(this)) < _amount)
            revert InsufficientFundsPleaseTryAgain();

        // check it safeTransfer funtion goes through else revert claim failed
        IERC20(tokenAddress).safeTransfer(_to, _amount);
    }

    function _onlyOwner() private view {
        if (msg.sender != owner) revert YouAreNotTheOwner();
    }
}
