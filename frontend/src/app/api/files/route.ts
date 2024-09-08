import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { pinata } from "@/utils/config";

export const config = {
    api: {
        bodyParser: true,
    },
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const imageUrl = body.imageUrl;
    
    if (!imageUrl || typeof imageUrl !== 'string') {
        return NextResponse.json(
            { error: "Valid image URL is required" },
            { status: 400 }
        );
    }

    try {
        const urlStream = await fetch(imageUrl);
        const arrayBuffer = await urlStream.arrayBuffer();
        const blob = new Blob([arrayBuffer]);
        const file = new File([blob], "file");
        const data = new FormData(); 
        data.append("file", file);
        const uploadData = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PINATA_JWT}`,
                },
                body: data,
            }
        );
        const uploadRes = await uploadData.json();
        console.log(uploadRes);
        const imgCid = uploadRes.IpfsHash;
        // Prepare OpenSea Metadata for Pinata
        const metadata = JSON.stringify({
            pinataContent: {
                name: "Aetheral PFPAI",
                description: "AI Generated Profile Picture in Galadriel Devnet",
                image: `ipfs://${imgCid}`,
                attributes: [],
            },
        });
        // Upload metadata to Pinata
        const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
            },
            body: metadata,
        });
        const metedataData = await metadataRes.json();
        const metadataCid = metedataData.IpfsHash;

        const imgData = `https://ipfs.io/ipfs/${imgCid}`;

        return NextResponse.json({metadataUrl: metadataCid, imageUrl: imgCid, imgData: imgData}, { status: 200 });
    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json(
            { error: "Invalid URL or unable to download image" }, 
            { status: 400 }
        );
    }
}
