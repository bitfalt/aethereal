//@ts-nocheck

"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { Navbar } from '@/components/Navbar';
import { client } from "@/app/client";
import { totalSupply } from "thirdweb/extensions/erc721";
import { readContract } from "thirdweb";
import { defineChain, getContract } from "thirdweb";

const galadrielDevnet = defineChain(696969);
const aether = getContract({
  address: "0x90D0cf5780F502B3DAc6C1e06Afc2D2575c77f5A",
  chain: galadrielDevnet,
  client
});

// Define the font
const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  creator: string;
}

const getFeaturedNfts = async () => {
  try {
    const supply = await totalSupply({contract: aether});
    console.log("Supply: ");
    console.log(supply);
    let indexedNfts = [];
    for (let i = Number(supply) - 1; i >= 0 ; i--) {
      if (indexedNfts.length >= 12) break

      const input = await readContract({
        contract: aether,
        method: "function mintInputs(uint256 tokenId) returns (address, string, bool)",
        params: [i]
      })

      const creator = input[0];      

      const tokenUri = await readContract({
        contract: aether,
        method: "function tokenURI(uint256 tokenId) returns (string)",
        params: [i]
      });
      if (tokenUri) {
        indexedNfts.push({ id: i, name: `Aether #${i}`, imageUrl: tokenUri, creator: creator });
      }
    }
    return indexedNfts;
  } catch (error) {
    console.error("Error getting featured NFTs:", error);
  }
};


export default function FeaturedPage() {
  const [recentNFTs, setRecentNFTs] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const featuredNfts = await getFeaturedNfts();
        if (featuredNfts) {
          //@ts-ignore
          setRecentNFTs(featuredNfts);
          console.log("Featured NFTs:");
          console.log(featuredNfts);
        }
      } catch (error) {
        console.error("Error fetching featured NFTs:", error);
      }
    };
    fetchNFTs();
  }, []);
  return (
    <div className={`${etna.className} bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <header className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white">Featured NFTs</h1>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Discover the latest and most exciting digital artworks in our curated collection.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNFTs.map((nft) => (
              <div
                key={nft.id}
                className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image 
                    src={nft.imageUrl} 
                    alt={nft.name} 
                    layout="fill" 
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <h2 className="text-2xl font-bold mb-2 text-white">{nft.name}</h2>
                      <p className="text-indigo-200">by {nft.creator}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
