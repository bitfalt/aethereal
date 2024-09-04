"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState("");

  const uploadFile = async () => {
    try {
      setUploading(true);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const metadata = await uploadRequest.json();
      console.log(metadata);
      setImgData(metadata.imgData);
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {imgData && <img src={imgData} alt="Uploaded image" className="mt-4 max-w-md" />}
    </main>
  );
}
