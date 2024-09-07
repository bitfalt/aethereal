"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import aetherealLogo from "@public/logo.svg";
import walletIcon from "@public/wallet.svg";
import { client } from "./client";
import { defineChain } from "thirdweb";
import localFont from 'next/font/local';
import { icons } from "@/utils/iconImports";

// Define the font
const etna = localFont({ src: '../../public/fonts/Etna-Sans-serif.otf' });

export default function Home() {
  // Define Galadriel chain
  const galadrielDevnet = defineChain(696969);
  return (
    <div className={`${etna.className} bg-gradient-to-b from-zinc-900 to-indigo-950 min-h-screen relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50"></div>
      <div className="relative z-10">
        <Navbar />
        <main className="p-4 pb-10 min-h-[calc(100vh-64px)] flex items-center justify-center container max-w-screen-lg mx-auto">
          <div className="py-20">
            <Header />

            <div className="flex justify-center mb-20">
              <button
                onClick={() => window.location.href = '/create/page'}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Create Now
              </button>
            </div>

            <Resources />
          </div>
        </main>
      </div>
    </div>
  );
}

function Navbar() {
  // Define Galadriel chain
  const galadrielDevnet = defineChain(696969);

  return (
    <nav className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image
            src={aetherealLogo}
            alt="Logo"
            className="size-8 md:size-10"
          />
          <span className="text-xl md:text-3xl font-bold text-zinc-100 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Aethereal</span>
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

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={aetherealLogo}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #2626a9a8)",
        }}
      />

      <h1 className="text-3xl md:text-6xl font-semibold md:font-bold mb-1 text-zinc-100 text-center">
        Create Your<br />Unique NFT Art with AI
      </h1>
    </header>
  );
}

function Resources() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="Input Your Preferences"
        description="Describe your desired artwork and set preferences"
        icon={<Image src={icons.input} alt="Input icon" width={40} height={40} />}
      />

      <ArticleCard
        title="Generate Art"
        description="AI creates unique artwork based on your input"
        icon={<Image src={icons.generate} alt="Generate icon" width={40} height={40} />}
      />

      <ArticleCard
        title="Mint & Share"
        description="Mint your AI-generated art as an NFT and share it"
        icon={<Image src={icons.share} alt="Share icon" width={40} height={40} />}
      />
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm p-6 rounded-xl border border-zinc-700">
      {props.icon && (
        <div className="flex mb-4 text-indigo-400">
          {props.icon}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-3 text-zinc-100">{props.title}</h2>
      <p className="text-sm text-zinc-400">{props.description}</p>
    </div>
  );
}
