'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { Navbar } from '@/components/Navbar'; 
import { client } from '@/app/client'
import { defineChain, getContract, readContract, prepareContractCall, sendTransaction, waitForReceipt, getContractEvents } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";

// Define the font
const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = ['realistic', 'cartoon', 'anime', 'game'];

  const galadrielDevnet = defineChain(696969);
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
  const account = useActiveAccount();

  // Web3 Functions
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


  const mintNft = useCallback(async () => {
    try {
    const message = prompt + " with a " + style;
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
      const image = String(tokenUri);
      setGeneratedImage(image);
    } else {
      console.error("Failed to get NFT ID from receipt");
    }
  } catch (e) {
    console.error(e);
  }
  }, [account, client, galadrielDevnet]
);

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length <= 50) {
      setPrompt(input);
    }
  }, []);



  const handleGenerateAndMint = async () => {
    if (!prompt || !style) {
      setError('Please provide both a prompt and a style.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      mintNft();
      //updateLeaderboard();
      // You might want to show a success message or redirect the user here
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${etna.className} bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar /> 
        <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="bg-indigo-900/50 backdrop-blur-sm p-10 rounded-xl border border-indigo-700 w-full max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/2 space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-4 text-white">Idea</h2>
                  <input
                    type="text"
                    value={prompt}
                    onChange={handlePromptChange}
                    placeholder="Make a magical and wise wizard frog"
                    className="w-full p-4 text-lg bg-indigo-800/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                    maxLength={50}
                  />
                  <p className="text-sm text-indigo-300 mt-2">
                    {prompt.length}/50 characters
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-semibold mb-4 text-white">Style</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {styles.map((styleOption) => (
                      <button
                        key={styleOption}
                        onClick={() => setStyle(styleOption)}
                        className={`px-6 py-4 text-xl font-semibold rounded-lg transition-all ${
                          style === styleOption
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50 hover:shadow'
                        }`}
                      >
                        {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateAndMint}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-lg w-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Generating & Minting...' : 'Generate & Mint NFT'}
                </button>

                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
              
              <div className="w-full lg:w-1/2">
                <div className="border-4 border-indigo-600 rounded-lg aspect-square flex items-center justify-center bg-indigo-800/30 overflow-hidden">
                  {generatedImage ? (
                    <Image
                      src={generatedImage}
                      alt="Generated Image"
                      width={600}
                      height={600}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                          <p className="text-indigo-300 text-2xl">Generating NFT...</p>
                        </div>
                      ) : (
                        <p className="text-indigo-300 text-2xl">Your image will appear here</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
