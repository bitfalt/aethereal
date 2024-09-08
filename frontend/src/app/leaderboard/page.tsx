"use client";

import React, { useEffect, useState } from 'react';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import Link from 'next/link';
import localFont from 'next/font/local';
import { client } from '@/app/client';
import { defineChain, getContract, readContract } from 'thirdweb';
import { Navbar } from '@/components/Navbar'; 
import Avatar from '../../components/Avatar';

interface LeaderboardEntry {
  rank: number;
  username: string;
  nftsMinted: number;
  avatarUrl?: string;
}

const etna = localFont({ src: '../../../public/fonts/Etna-Sans-serif.otf' });

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const galadrielDevnet = defineChain(696969);
        const leaderboard = getContract({
          address: "0x2a10de5b190445aA20a3b44cDE936b65025Eadbf",
          chain: galadrielDevnet,
          client
        });

        const data: LeaderboardEntry[] = [];
        for (let i = 0; i < 5; i++) {
          const user = await readContract({
            contract: leaderboard,
            method: "function getUserByIndex(uint8 index) returns (address, uint256)",
            params: [i]
          });
          data.push({
            rank: i + 1,
            username: user[0],
            nftsMinted: Number(user[1]),
            avatarUrl: ""
          });
        }
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={`${etna.className} min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] flex flex-col`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-70"></div>
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-indigo-900/30 backdrop-blur-md rounded-lg shadow-xl p-8 w-full max-w-4xl">
          <h1 className="mb-10 text-center">
            <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-gradient-x tracking-wide">
              TOP CREATORS
            </span>
            <div className="mt-2 text-lg font-light text-indigo-300">
              Exploring the NFT Universe
            </div>
          </h1>
          
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-4 mb-6 text-lg font-bold text-indigo-100 border-b-2 border-indigo-500/30 pb-3">
            <div>Rank</div>
            <div className="col-span-2">Creator</div>
            <div className="text-right">NFTs Minted</div>
          </div>

          {isLoading ? (
            <div className="text-center text-indigo-300">Loading leaderboard...</div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((entry) => (
                <Link href={`/profile/${entry.username}`} key={entry.rank}>
                  <div className="grid grid-cols-4 gap-4 items-center bg-indigo-800/30 p-5 rounded-lg transition-all hover:bg-indigo-700/40 hover:shadow-lg hover:scale-105 cursor-pointer">
                    <div className="flex items-center justify-center w-8 h-8">
                      {entry.rank === 1 && <FaTrophy size={24} color="#FBBF24" />}
                      {entry.rank === 2 && <FaMedal size={24} color="#D1D5DB" />}
                      {entry.rank === 3 && <FaMedal size={24} color="#FB923C" />}
                      {entry.rank > 3 && <span className="text-xl font-semibold text-indigo-200">{entry.rank}</span>}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <Avatar user={entry} />
                      <span className="font-semibold text-indigo-100 text-lg">{entry.username}</span>
                    </div>
                    <div className="text-right font-bold text-blue-400 text-lg">{entry.nftsMinted}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Real-time update indicator */}
          <div className="mt-10 text-center text-sm text-indigo-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Leaderboard updates in real-time
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
