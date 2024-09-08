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

  // call to update leaderboard with user address and score (called by Aether contract)
  function updateUserScore(address userAddress, uint score) public {

    // loop through the leaderboard
    for (uint8 i=0; i<leaderboardLength; i++) {
      // find where to insert the new score
      if (leaderboard[i].score < score) {

        // shift leaderboard
        User memory currentUser = leaderboard[i];
        for (uint8 j=i+1; j<leaderboardLength+1; j++) {
          User memory nextUser = leaderboard[j];
          leaderboard[j] = currentUser;
          currentUser = nextUser;
        }

        // insert
        leaderboard[i] = User({
          userAddress: userAddress,
          score: score
        });

        // delete last from list
        delete leaderboard[leaderboardLength];
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