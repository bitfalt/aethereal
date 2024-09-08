import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface NFTPreviewModalProps {
  nft: {
    id: number;
    name: string;
    image: string;
    description: string;
    artist: string;
  };
  onClose: () => void;
}

export default function NFTPreviewModal({ nft, onClose }: NFTPreviewModalProps) {
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

    const rotateX = (mouseY / height) * 20;
    const rotateY = (mouseX / width) * 20;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div 
        className="w-full max-w-md"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={cardRef}
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          <div className="relative bg-gray-900 rounded-3xl p-1 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-2xl overflow-hidden">
              <div className="relative aspect-square w-full">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>

              <div className="relative p-6 space-y-4">
                <h1 className="text-3xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
                    {nft.name}
                  </span>
                </h1>
                <p className="text-sm text-gray-300">
                  Created by <span className="font-semibold text-pink-400">{nft.artist}</span>
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {nft.description}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-20 h-20 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      <button 
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
}
