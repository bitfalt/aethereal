import React from 'react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { Navbar } from '@/components/Navbar';

// Define the font
const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

interface NFT {
  id: string;
  name: string;
  imageUrl: string;
  creator: string;
}

// This would typically come from an API or database
const recentNFTs: NFT[] = [
  { id: '1', name: 'Cosmic Voyage', imageUrl: '/placeholder.png', creator: 'Artist1' },
  { id: '2', name: 'Digital Dreams', imageUrl: '/placeholder.png', creator: 'Artist2' },
  { id: '3', name: 'Neon Nights', imageUrl: '/placeholder.png', creator: 'Artist3' },
  { id: '4', name: 'Ethereal Echoes', imageUrl: '/placeholder.png', creator: 'Artist4' },
  { id: '5', name: 'Quantum Quill', imageUrl: '/placeholder.png', creator: 'Artist5' },
  { id: '6', name: 'Stellar Synthesis', imageUrl: '/placeholder.png', creator: 'Artist6' },
  // Add more NFTs as needed
];

export default function FeaturedPage() {
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

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg text-lg font-semibold">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
