import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { pinata } from "@/utils/config";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    // Get the image URL from generated Galadriel URL
    const imageUrl = req.body;
    if (!imageUrl) {
        return NexteResponse.json(
            { error: "Image URL is required"},
            { status: 400 }
        );
    }    

    try {

        // Download image
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer'});
        const buffer = Buffer.from(imageResponse.data, 'binary');
        
        // Prepare form data for Pinata
        const data = new formData();
        data.set("file", buffer, {
            filename: 'image.png',
            contentType: 'image/png',
        });
        const file: File | null = data.get("file") as unknown as File;
        // Upload image to Pinata
        const uploadData = await pinata.upload.file(file);
        // Prepare OpenSea Metadata for Pinata
        const metadata = {
            name: "Dave Starbelly",
            description: "Friendly OpenSea Creature that enjoys long swims in the ocean.",
            image: `ipfs://${uploadData.cid}`,
            attributes: [],
        };
        // Upload metadata to Pinata
        const uploadMetadata = await pinata.upload.json(metadata);
        const metadataCid = uploadMetadata.cid;

        return NextResponse.json(metadataCid, { status: 200 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}
