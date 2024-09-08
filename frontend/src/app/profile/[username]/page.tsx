'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useActiveAccount } from "thirdweb/react";
import { client } from '@/app/client'
import { defineChain, getContract, readContract } from "thirdweb";
import { tokenOfOwnerByIndex } from "thirdweb/extensions/erc721";
import { Navbar } from '@/components/Navbar';
import NFTPreviewModal from '@/components/NFTPreviewModal';
import EditProfileModal from '@/components/EditProfileModal';

// Define the font
const etna = localFont({ src: '../../../../public/fonts/Etna-Sans-serif.otf' });

// Define chain and smart contract
const galadrielDevnet = defineChain(696969);
const aether = getContract({
  address: "0x90D0cf5780F502B3DAc6C1e06Afc2D2575c77f5A",
  chain: galadrielDevnet,
  client
});

// Types
type NFT = {
  id: number;
  name: string;
  image: string;
  description: string;
  artist: string;
};

type User = {
  name: string;
  avatar: string;
  bio: string;
};

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const account = useActiveAccount();
  const address = account?.address;

  const [user, setUser] = useState<User | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUserNfts = async () => {
    let indexedUserNfts = [];
    for (let i = 0; i < 6; i++) {
      try {
        const token = await tokenOfOwnerByIndex({
          contract: aether,
          owner: username,
          index: i
        });
        console.log("Token:", token);
        if (token !== undefined) {

          const input = await readContract({
            contract: aether,
            method: "function mintInputs(uint256 tokenId) returns (address, string, bool)",
            params: [token]
          })

          const creator = input[0];
          const prompt = input[1];

          const tokenUri = await readContract({
            contract: aether,
            method: "function tokenURI(uint256 tokenId) returns (string)",
            params: [token]
          });
          if (tokenUri) {
            indexedUserNfts.push({ creator: creator, prompt: prompt, tokenId: Number(token), tokenUri });
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


  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userNfts = await getUserNfts();
        if (userNfts && userNfts.length > 0) {
          const nftsData = userNfts.map((nft, index) => ({
            id: index,
            name: `Aether #${nft.tokenId}`,
            image: nft.tokenUri,
            description: `${nft.prompt}`,
            artist: `AI used by ${nft.creator}`
          }));
          setNfts(nftsData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const openModal = (nft: NFT) => setSelectedNFT(nft);
  const closeModal = () => setSelectedNFT(null);

  return (
    <div className={`${etna.className} bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <section className="mb-12 bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-indigo-700 p-8 shadow-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-6 md:mb-0">
                <div className="relative">
                  <Image 
                    src={'/avatar.jpg'} 
                    alt="Profile Avatar" 
                    width={150} 
                    height={150} 
                    className="rounded-full border-4 border-indigo-500 shadow-lg" 
                  />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{username}</h1>
                  <div className="w-24 h-px bg-indigo-400 mx-auto md:mx-0 mb-4"></div>
                  <p className="text-lg text-indigo-100 max-w-md">{'NFT enthusiast and digital art collector'}</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-white">Generated NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <div 
                  key={nft.id} 
                  className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-700 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md cursor-pointer"
                  onClick={() => openModal(nft)}
                >
                  <div className="aspect-square">
                    <Image src={nft.image} alt={nft.name} width={300} height={300} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-center font-medium py-3 bg-indigo-800/50 text-indigo-100">{nft.name}</p>
                </div>
              ))}
              {address === username && (
                <Link href="/create" className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 group shadow-md">
                  <div className="aspect-square flex items-center justify-center">
                    <div className="text-6xl text-white group-hover:scale-110 transition-transform duration-300">+</div>
                  </div>
                  <p className="text-center font-medium py-3 bg-indigo-700/50 text-white">Create New NFT</p>
                </Link>
              )}
            </div>
          </section>
        </div>
      </div>
      {selectedNFT && (
        <NFTPreviewModal nft={selectedNFT} onClose={closeModal} />
      )}

    </div>
  );
};

export default ProfilePage;