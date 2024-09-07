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
    <div className={etna.className}>
      <Navbar />
      <main className="p-4 pb-10 min-h-[calc(100vh-64px)] flex items-center justify-center container max-w-screen-lg mx-auto">
        <div className="py-20">
          <Header />

          <div className="flex justify-center mb-20">
            <button
              onClick={() => window.location.href = '/create/page'}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 pb-5 rounded-full text-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Now
            </button>
          </div>

          <Resources />
        </div>
      </main>
    </div>
  );
}

function Navbar() {
  // Define Galadriel chain
  const galadrielDevnet = defineChain(696969);

  return (
    <nav className="bg-zinc-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src={aetherealLogo}
            alt="Logo"
            className="size-9 mr-2"
          />
          <span className="text-2xl font-bold text-zinc-100">Aethereal</span>
        </div>
        <ConnectButton
          client={client}
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
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="Input Your Preferences"
        description="Describe your desired artwork and set preferences"
        icon={<Image src={icons.input} alt="Input icon" width={32} height={32} />}
      />

      <ArticleCard
        title="Generate Art"
        description="AI creates unique artwork based on your input"
        icon={<Image src={icons.generate} alt="Generate icon" width={32} height={32} />}
      />

      <ArticleCard
        title="Mint & Share"
        description="Mint your AI-generated art as an NFT and share it"
        icon={<Image src={icons.share} alt="Share icon" width={32} height={32} />}
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
    <div className="border border-zinc-800 p-4 rounded-lg">
      {props.icon && (
        <div className="flex mb-3">
          {props.icon}
        </div>
      )}
      <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
      <p className="text-sm text-zinc-400">{props.description}</p>
    </div>
  );
}
