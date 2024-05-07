const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Import CORS package

const app = express();
const PORT = 3000;

// Directories for videos and thumbnails
const videosDir = path.join(__dirname, 'uploads/videos');
const thumbnailsDir = path.join(__dirname, 'src/main/resources/static/public/thumbnails');

app.use('/videos', express.static(path.join(__dirname, 'uploads/videos')));
app.use('/thumbnails', express.static(path.join(__dirname, 'src/main/resources/static/public/thumbnails')));


// Use CORS to allow all cross-origin requests
app.use(cors());

// Serve static files from 'public'
app.use(express.static('src/main/resources/static/public'));
app.use('/thumbnails', express.static(thumbnailsDir));  //
// Route to list videos and their thumbnails
app.get('/videos', (req, res) => {
    fs.readdir(videosDir, (err, files) => {
        if (err) {
            console.error("Error reading video directory:", err);
            return res.status(500).send('Error reading video directory.');
        }

        // Filter video files, assuming MP4 format
        const videos = files.filter(file => file.endsWith('.mp4')).map(file => {
            const baseName = path.basename(file, '.mp4');
            const encodedFileName = encodeURIComponent(file);
            const encodedBaseName = encodeURIComponent(baseName);
            const thumbnailUrl = `/thumbnails/${encodedBaseName}_thumbnail.png`; // Ensure thumbnail filenames are URL-encoded
            return {
                name: file,
                url: `/videos/${encodedFileName}`, // Ensure video filenames are URL-encoded
                thumbnailUrl: thumbnailUrl
            };
        });

        console.log("Video data sent:", videos);
        res.json(videos);
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
