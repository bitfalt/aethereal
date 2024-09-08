Here's a README file for the project:

# Aethereal - AI-Generated NFT Platform

Aethereal is a platform that allows users to create unique NFT art using AI. Users can input their preferences, generate art, and mint it as an NFT on the Galadriel blockchain. The platform also features a leaderboard to track top creators and a featured NFTs section to showcase the best art.

## Tech Stack

- Next.js: React framework for building the frontend
- Thirdweb: Web3 development framework for blockchain interactions
- Galadriel: AI-capable blockchain for NFT minting and smart contract execution
- Tailwind CSS: Utility-first CSS framework for styling

## Features

- Create AI-generated NFT art
- Mint NFTs on the Galadriel blockchain
- View and showcase NFTs in a user profile
- Leaderboard to track top creators
- Featured NFTs section

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/aethereal.git
   cd aethereal
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_TEMPLATE_CLIENT_ID=your_thirdweb_client_id
   ```

### Running the Project

1. Start the development server:
   ```
   pnpm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Project Structure

`frontend` Contains the whole application, inside the frontend folder there is a `thirdweb-contracts` folder that contains the smart contracts for the platform.


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.