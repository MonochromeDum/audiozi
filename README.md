# Cobalt.tools Ultra Downloader (Self-Hosted)

A feature-rich, multi-site, playlist-capable, mobile-friendly downloader inspired by [Cobalt.tools](https://github.com/wasi-master/cobalt).

## Features

- Download video/audio from YouTube, SoundCloud, TikTok, and more
- Supports MP3, MP4, WAV, OGG, M4A, AAC
- Quality/resolution selection
- Fetch video & playlist metadata
- Download whole playlists or select items
- Custom filename, audio trimming (start/end)
- Subtitles (auto or manual, language selection)
- Dark/Light mode toggle
- Clipboard paste, mobile-friendly UI
- Download history (local)
- Progress indication

## Requirements

- Node.js
- [yt-dlp](https://github.com/yt-dlp/yt-dlp#installation) (`pip install -U yt-dlp`)
- [ffmpeg](https://ffmpeg.org/)

## Usage

1. Clone/download this repo.
2. Install dependencies:
   ```
   npm install express cors
   ```
3. Make sure `yt-dlp` and `ffmpeg` are in your PATH.
4. Start the server:
   ```
   node server.js
   ```
5. Open [http://localhost:3001](http://localhost:3001).

## Legal Notice

Downloading from some sites may violate their terms or copyright law. Use responsibly!
