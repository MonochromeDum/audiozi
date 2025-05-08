const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const path = require("path");
const os = require("os");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

function getTmpFile(ext) {
  return path.join(os.tmpdir(), `cobalt_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`);
}

// Get metadata
app.post("/api/info", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required." });
  let info = "";
  const ytdlp = spawn("yt-dlp", [
    "--dump-json",
    "--no-warnings",
    "--skip-download",
    url,
  ]);
  ytdlp.stdout.on("data", (data) => (info += data.toString()));
  let stderr = "";
  ytdlp.stderr.on("data", (data) => (stderr += data.toString()));
  ytdlp.on("close", (code) => {
    try {
      const meta = JSON.parse(info);
      res.json(meta);
    } catch (e) {
      res.status(500).json({ error: "Could not fetch info.", details: stderr });
    }
  });
});

// Download endpoint
app.post("/api/download", (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) return res.status(400).json({ error: "URL/format required." });

  // MP3/MP4 supported
  const ext = format === "mp3" ? "mp3" : "mp4";
  const tmpFile = getTmpFile(ext);

  let ytdlpArgs = ["-o", tmpFile, url];
  if (format === "mp3") {
    ytdlpArgs.unshift("-x", "--audio-format", "mp3");
  } else {
    ytdlpArgs.push("-f", "mp4");
  }

  const ytdlp = spawn("yt-dlp", ytdlpArgs);

  let stderr = "";
  ytdlp.stderr.on("data", (data) => (stderr += data));
  ytdlp.on("close", (code) => {
    fs.stat(tmpFile, (err, stat) => {
      if (err || !stat) {
        res.status(500).json({ error: "Download failed.", details: stderr });
        return;
      }
      res.setHeader("Content-Disposition", `attachment; filename="download.${ext}"`);
      res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "video/mp4");
      const stream = fs.createReadStream(tmpFile);
      stream.pipe(res);
      stream.on("end", () => fs.unlink(tmpFile, () => {}));
      stream.on("error", () => fs.unlink(tmpFile, () => {}));
    });
  });
});

app.get("/", (req, res) => {
  res.send("Cobalt.tools Downloader API is running.");
});

app.listen(PORT, () => {
  console.log(`Cobalt.tools downloader server running on port ${PORT}`);
});