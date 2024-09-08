"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { useRouter } from 'next/navigation';
import { defineChain } from "thirdweb";
import aetherealLogo from "@public/logo.svg";
import profileIcon from "@public/profile.svg";
import { client } from "@/app/client";

export function Navbar() {
  const router = useRouter();
  // Define Galadriel chain
  const galadrielDevnet = defineChain(696969);

  return (
    <nav className="bg-[#1e1b4b]/80 backdrop-blur-md border-b border-indigo-700 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <Image
              src={aetherealLogo}
              alt="Logo"
              className="size-8 md:size-12"
            />
            <span className="text-xl md:text-4xl font-bold text-zinc-100 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Aethereal</span>
          </div>
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-white hover:text-indigo-300 transition duration-300 ease-in-out self-end mb-1 text-lg opacity-80 ml-8"
          >
            Leaderboard
          </button>
        </div>
        <div className="flex items-center space-x-4">
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
          <button
            onClick={() => router.push('/profile')}
            className="bg-white hover:bg-gray-100 p-3 rounded-lg transition duration-300 ease-in-out"
            aria-label="Profile"
          >
            <Image src={profileIcon} alt="Profile" width={26} height={26} />
          </button>
        </div>
      </div>
    </nav>
  );
}
