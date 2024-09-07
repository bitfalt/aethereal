'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { ConnectButton } from "thirdweb/react";
import aetherealLogo from "@public/logo.svg";
import { client } from "../client";
import { defineChain } from "thirdweb";

// Define the font
const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');

  const styles = ['realistic', 'cartoon', 'anime', 'game'];

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input.length <= 50) {
      setPrompt(input);
    }
  }, []);

  const handleGenerate = async () => {
    // TODO: Implement API call to generate image
    setGeneratedImage('/placeholder.jpg');
  };

  const handleMint = () => {
    // TODO: Implement minting functionality
    console.log('Minting image...');
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
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-5 px-8 rounded-lg w-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Generate Image
                </button>

                {generatedImage && (
                  <button
                    onClick={handleMint}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 px-8 rounded-lg w-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Mint
                  </button>
                )}
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
                    <p className="text-indigo-300 text-2xl">Your image will appear here</p>
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

function Navbar() {
  // Define Galadriel chain
  const galadrielDevnet = defineChain(696969);

  return (
    <nav className="bg-[#1e1b4b]/80 backdrop-blur-md border-b border-indigo-700 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src={aetherealLogo}
            alt="Logo"
            className="size-8 md:size-12"
          />
          <span className="text-xl md:text-4xl font-bold text-zinc-100 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Aethereal</span>
        </div>
        <ConnectButton
          client={client}
          connectButton={{label: "Connect"}}
          accountAbstraction={{
            chain: galadrielDevnet,
            sponsorGas: false,
          }}
          appMetadata={{
            name: "Aethereal",
            url: "https://example.com",
          }}
        />
      </div>
    </nav>
  );
}
