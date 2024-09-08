'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import NFTPreviewModal from '@/components/NFTPreviewModal';

interface NFT {
  id: number;  // Changed from string to number
  name: string;
  image: string;
  description: string;
  artist: string;
}

// Update mockNFTs to use number IDs
const mockNFTs: NFT[] = [
  { id: 1, name: 'NFT 1', image: '/nft1.jpg', description: 'Description 1', artist: 'Artist 1' },
  { id: 2, name: 'NFT 2', image: '/nft2.jpg', description: 'Description 2', artist: 'Artist 2' },
  // Add more mock NFTs as needed
];

export default function ProfilePage() {
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  const openModal = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
  };

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          {/* NFT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockNFTs.map((nft) => (
              <div 
                key={nft.id} 
                className="cursor-pointer bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                onClick={() => openModal(nft)}
              >
                <Image
                  src={nft.image}
                  alt={nft.name}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <p className="mt-2 text-white">{nft.name}</p>
              </div>
            ))}
          </div>

          {/* NFT Preview Modal */}
          {selectedNFT && (
            <NFTPreviewModal nft={selectedNFT} onClose={closeModal} />
          )}
        </div>
      </div>
    </div>
  );
}