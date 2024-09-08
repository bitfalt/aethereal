'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';

export default function NFTPreviewPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / height) * 20; // Max rotation of 20 degrees
    const rotateY = (mouseX / width) * 20;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          <div 
            className={`w-full max-w-md transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={cardRef}
          >
            {/* Existing NFT preview card content */}
            <div className="relative group">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              {/* Card content */}
              <div className="relative bg-gray-900 rounded-3xl p-1 backdrop-blur-sm">
                <div className="bg-gray-800 rounded-2xl overflow-hidden">
                  {/* NFT Image */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/placeholder.jpg"
                      alt="NFT Preview"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  </div>

                  {/* NFT Details */}
                  <div className="relative p-6 space-y-4">
                    <h1 className="text-3xl font-bold leading-tight">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                        NFT Title
                      </span>
                    </h1>
                    <p className="text-sm text-gray-300">
                      Created by <span className="font-semibold text-pink-400">Artist Name</span>
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Description of this captivating NFT. Unveiling its unique features, artistic vision, and the story behind its creation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
