import React, { useState } from "react";
function App() {
  const [url, setUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const response = await fetch("/api/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "audio.mp3";
      link.click();
    } else {
      alert("Failed to download audio");
    }
    setDownloading(false);
  };

  return (
    <div style={{ margin: "40px" }}>
      <h1>YouTube/Video Audio Downloader</h1>
      <input
        type="text"
        placeholder="Paste video link here"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "400px" }}
      />
      <button onClick={handleDownload} disabled={downloading || !url}>
        {downloading ? "Downloading..." : "Download Audio"}
      </button>
    </div>
  );
}
export default App;