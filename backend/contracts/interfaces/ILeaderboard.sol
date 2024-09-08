// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILeaderboard {
    struct User {
        address userAddress;
        uint256 score;
    }

    function updateUserScore(address userAddress, uint256 score) external;
    function getUserScore(address userAddress) external view returns (uint256);
}