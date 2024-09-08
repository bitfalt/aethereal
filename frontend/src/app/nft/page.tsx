"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { client } from "../client";
import { defineChain, getContract, readContract, prepareContractCall, sendTransaction, waitForReceipt, getContractEvents } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
//import { HypersyncClient, Decoder, presetQueryLogsOfEvent } from '@envio-dev/hypersync-client'

export default function Home() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState("");


  const galadrielDevnet = defineChain(696969);
  const account = useActiveAccount();
  const leaderboard = getContract({
    address: "0xbbA6B081A01A587574Aea611dFD6e11442e25fa1",
    chain: galadrielDevnet,
    client
  })
  const aether = getContract({
    address: "0x90D0cf5780F502B3DAc6C1e06Afc2D2575c77f5A",
    chain: galadrielDevnet,
    client
  })

  const getLeaderboard = async () => {
    for (let i = 0; i < 5; i++) {
      const user = await readContract({
        contract: leaderboard,
        method: "function getUserByIndex(uint8 index) returns (address, uint256)",
        params: [i]
      });
      console.log("User: ", user);
    }
  }

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
    for (let i = 0; i < 3; i++) {
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

  // const envioFeatured = async () => {
  //   const client = HypersyncClient.new({
  //     url: "https://696969.hypersync.xyz"
  //   });

  //   const aetherContract = "0x90D0cf5780F502B3DAc6C1e06Afc2D2575c77f5A";
  //   const eventTopic = "0xd469a7325078a9e6013e0619cb6e9472faf345ebd8469fe6bf9fc7ee67008e03"

  //   let query = presetQueryLogsOfEvent(aetherContract, eventTopic, 35_380_037);
  //   console.log("Running query...");
  //   const results = await client.get(query);

  //   console.log("Query results: ");
  //   console.log(results);

  //   console.log(`Query returned ${results.data.logs.length} logs of events`); 
  //   console.log("Query logs:");
  //   console.log(results.data.logs);

  //   const decoder = new Decoder();
  //   const decodedLogs = decoder.decodeLogs(results.data.logs);
  //   console.log("Decoded logs:");
  //   console.log(decodedLogs);
  // }


  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
        <Navbar/>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button onClick={mintNft} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        Mint NFT
      </button>
      <button onClick={getUserNfts} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
        Get User NFTs
      </button>
      <button onClick={getLeaderboard} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Get Leaderboard
      </button>
      <button onClick={envioFeatured} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Envio Featured
      </button>
    </main>
  );
}
