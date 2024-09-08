'use client';

import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Image from 'next/image';
import Link from 'next/link';
import avatarImage from '/public/avatar.jpg';
import localFont from 'next/font/local';
import { useAddress } from "@thirdweb-dev/react";
import { Navbar } from '@/components/Navbar'; 

// Define the font
const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

// Mock data for user (replace this with actual user data fetching logic)
const mockUser = {
  name: 'Alvaro Lazarus',
  username: '@lazarus',
  avatar: '/avatar.jpg',
  bio: 'NFT enthusiast and digital art collector',
};

// Mock data for NFTs (replace this with actual data fetching logic)
const mockNFTs = [
  { id: 1, name: 'NFT 1', image: '/placeholder.jpg' },
  { id: 2, name: 'NFT 2', image: '/placeholder.jpg' },
  { id: 3, name: 'NFT 3', image: '/placeholder.jpg' },
];

const ProfilePage = () => {
  const address = useAddress();

  return (
    <div className={`${etna.className} bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar />  {/* Use the imported Navbar component */}
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <section className="mb-12 bg-indigo-900/50 backdrop-blur-sm rounded-xl border border-indigo-700 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-6 md:mb-0">
                <Image 
                  src={avatarImage} 
                  alt="Profile Avatar" 
                  width={150} 
                  height={150} 
                  className="rounded-full border-4 border-indigo-500 shadow-lg" 
                />
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">{mockUser.name}</h1>
                  <p className="text-xl text-indigo-300 mb-4">{mockUser.username}</p>
                  <p className="text-lg text-indigo-100">{mockUser.bio}</p>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <div className={`px-4 py-2 rounded-full ${address ? 'bg-green-500/20 text-green-300 border border-green-500' : 'bg-red-500/20 text-red-300 border border-red-500'} backdrop-blur-sm`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${address ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span>{address ? 'Wallet Connected' : 'Wallet Disconnected'}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-white">Your Generated NFTs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockNFTs.map((nft) => (
                <div key={nft.id} className="bg-indigo-900/50 backdrop-blur-sm border border-indigo-700 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md">
                  <div className="aspect-square">
                    <Image src={nft.image} alt={nft.name} width={300} height={300} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-center font-medium py-3 bg-indigo-800/50 text-indigo-100">{nft.name}</p>
                </div>
              ))}
              <Link href="/create" className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 group shadow-md">
                <div className="aspect-square flex items-center justify-center">
                  <div className="text-6xl text-white group-hover:scale-110 transition-transform duration-300">+</div>
                </div>
                <p className="text-center font-medium py-3 bg-indigo-700/50 text-white">Create New NFT</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const WrappedProfilePage = () => {
  return (
    <ThirdwebProvider activeChain="ethereum">
      <ProfilePage />
    </ThirdwebProvider>
  );
};

export default WrappedProfilePage;
