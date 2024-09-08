"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { client } from "../client";
import { defineChain, getContract, readContract, prepareContractCall, sendTransaction, waitForReceipt, getContractEvents } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";

export default function Home() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState("");


  const galadrielDevnet = defineChain(696969);
  const account = useActiveAccount();
  const leaderboard = getContract({
    address: "0xE898120e6131a07ae0bFF9F82e43aEB6969F346A",
    chain: galadrielDevnet,
    client
  })
  const aether = getContract({
    address: "0x90D0cf5780F502B3DAc6C1e06Afc2D2575c77f5A",
    chain: galadrielDevnet,
    client
  })


  const updateLeaderboard = async () => {
    const oldScore = await readContract({
      contract: leaderboard,
      method: "function getUserScore(address userAddress) returns (uint256)",
      params: [account?.address]
    });
    const scoreInt = parseInt(oldScore);
    const score = scoreInt + 1;
    const transaction = prepareContractCall({
      contract: leaderboard,
      method: "function updateUserScore(address userAddress, uint256 score)",
      params: [account?.address, score]
    });
    const { transactionHash } = await sendTransaction({ account, transaction });
    console.log("Sent transaction");
    console.log("Transaction hash: ", transactionHash);
    const receipt = await waitForReceipt({
      client,
      chain: galadrielDevnet,
      transactionHash
    });
    console.log("Receipt: ", receipt);
  };



  // const uploadFile = async () => {
  //   try {
  //     setUploading(true);
  //     const uploadRequest = await fetch("/api/files", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ imageUrl: url }),
  //     });
  //     const metadata = await uploadRequest.json();
  //     console.log(metadata);
  //     setImgData(metadata.imgData);
  //     setUploading(false);
  //   } catch (e) {
  //     console.error(e);
  //     setUploading(false);
  //     alert("Trouble uploading file");
  //   }
  // };

  // const deployContract = async () => {
  //   const oldScore = await data;
  //   const scoreInt = parseInt(oldScore);
  //   const score = scoreInt + 1;
  //   const userAddress = account?.address;
  //   console.log(score);
  //   console.log(userAddress);
  //   const transaction = prepareContractCall({
  //     contract: leaderboard,
  //     method: "function updateUserScore(address userAddress, uint256 score)",
  //     params: [userAddress, score]
  //   });
  //   const { transactionHash} = await sendTransaction({account, transaction});
  //   console.log("Sent transaction");
  //   console.log("Transaction hash: ");
  //   console.log(transactionHash);
  //   const receipt = await waitForReceipt({
  //     client,
  //     chain: galadrielDevnet,
  //     transactionHash
  //   });
  //   console.log("Receipt: ");
  //   console.log(receipt);
  // };

  const mintNft = useCallback(async () => {
    try {
    const message = "Unicorn riding a rainbow through the sky";
    const transaction = prepareContractCall({
      contract: aether,
      method: "function initializeMint(string memory message)",
      params: [message]
    });
    const { transactionHash} = await sendTransaction({account, transaction});
    console.log("Sent transaction");
    console.log("Transaction hash: ");
    console.log(transactionHash);
    const receipt = await waitForReceipt({
      client,
      chain: galadrielDevnet,
      transactionHash
    });
    console.log("Receipt: ");
    console.log(receipt);

    const nftId = await getNftId(receipt);
    if (nftId !== undefined) {
      console.log("NFT ID:", nftId);
      const tokenUri = await pollTokenUri(nftId);
      console.log("Token URI: ");
      console.log(tokenUri);
    } else {
      console.error("Failed to get NFT ID from receipt");
    }

  } catch (e) {
    console.error(e);
  }
  }, [account, client, galadrielDevnet]
);

  const getNftId = async (receipt: any): Promise<number | undefined> => {
    let nftId;
    if (receipt) {
      try {
        const eventsPromise = getContractEvents({
          contract: aether,
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber,
          eventName: "MintInputCreated"
        });
        
        const events = await eventsPromise;
        console.log("Events: ");
        console.log(events);
        
        if (events && events.length > 0) {
          nftId = Number(events[0].args.chatId);
        }
      } catch (error) {
        console.error("Error getting NFT ID:", error);
      }
    }
    return nftId;
  };


  const getUserNfts = async () => {
    let indexedUserNfts = [];
    for (let i = 0; i < 5; i++) {
      try {

        const token = await tokenOfOwnerByIndex({
          contract: aether,
          owner: account?.address,
          index: i
        });
        console.log("Token:", token);
        if (token !== undefined) {
          const tokenUri = await readContract({
            contract: aether,
            method: "function tokenURI(uint256 tokenId) returns (string)",
            params: [token]
          });
          if (tokenUri) {
            indexedUserNfts.push({ tokenId: Number(token), tokenUri });
          }
        }
      } catch (e) {
        console.error(`Error fetching NFT at index ${i}:`, e);
        break;
      }
    }
    console.log("Indexed user NFTs:");
    console.log(indexedUserNfts);
    return indexedUserNfts;
  }

  const pollTokenUri = async (tokenId: number): Promise<string | undefined> => {
    // Wait for 20 seconds before starting the polling
    await new Promise(resolve => setTimeout(resolve, 20000));

    while (true) {
        const tokenUri = await readContract({
          contract: aether,
          method: "function tokenURI(uint256 tokenId) returns (string)",
          params: [tokenId]
        });
        if (tokenUri) {
          return tokenUri;
        }

      // Wait for 1 second before trying again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
        <Navbar/>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {imgData && <img src={imgData} alt="Uploaded image" className="mt-4 max-w-md" />}
      <button onClick={deployContract} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Deploy Contract
      </button>
      <button onClick={mintNft} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Mint NFT
      </button>
      <button onClick={getUserNfts} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
        Get User NFTs
      </button>
    </main>
  );
}
