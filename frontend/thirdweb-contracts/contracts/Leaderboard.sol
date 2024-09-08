// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Leaderboard {

  // lists top 5 users
    uint8 private leaderboardLength = 5;

    // create an array of Users
    mapping (uint8 => User) public leaderboard;
    
    // each user has an address and score
    struct User {
        address userAddress;
        uint256 score;
    }

    function getUserByIndex(uint8 index) public view returns (address, uint256) {
        return (leaderboard[index].userAddress, leaderboard[index].score);
    }

    // call to update leaderboard with user address and score (called by Aether contract)
    function updateUserScore(address userAddress, uint256 score) public {
        // Check if the user is already in the leaderboard
        for (uint8 i = 0; i < leaderboardLength; i++) {
            if (leaderboard[i].userAddress == userAddress) {
                // Update the score if it's higher
                if (score > leaderboard[i].score) {
                    leaderboard[i].score = score;
                }
                // Sort the leaderboard
                sortLeaderboard();
                return;
            }
        }

        // If the user is not in the leaderboard, check if their score is high enough to be included
        if (leaderboard[leaderboardLength - 1].score < score || leaderboard[leaderboardLength - 1].userAddress == address(0)) {
            // Add the new user to the end of the leaderboard
            leaderboard[leaderboardLength - 1] = User({
                userAddress: userAddress,
                score: score
            });
            // Sort the leaderboard
            sortLeaderboard();
        }
    }

    // Helper function to sort the leaderboard
    function sortLeaderboard() private {
        for (uint8 i = 0; i < leaderboardLength - 1; i++) {
            for (uint8 j = i + 1; j < leaderboardLength; j++) {
                if (leaderboard[j].score > leaderboard[i].score) {
                    User memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
    }

    function getUserScore(address userAddress) public view returns (uint256) {
        for (uint8 i=0; i<leaderboardLength; i++) {
            if (leaderboard[i].userAddress == userAddress) {
                return leaderboard[i].score;
            }
        }
        return 0;
    }
}