const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Directories for videos and thumbnails
const videosDir = path.join(__dirname, 'uploads/videos');
const thumbnailsDir = path.join(__dirname, 'src/main/resources/static/public/thumbnails');

// Serve static files from 'public'
app.use(express.static('src/main/resources/static/public'));

// Route to list videos and their thumbnails
app.get('/videos', (req, res) => {
    fs.readdir(videosDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading video directory.');
        }

        // Filter video files, assuming MP4 format
        const videos = files.filter(file => file.endsWith('.mp4')).map(file => {
            const baseName = path.basename(file, '.mp4');
            const thumbnailUrl = `/thumbnails/${baseName}_thumbnail.png`;  // Assuming thumbnail naming convention
            return {
                name: file,
                url: `/videos/${file}`,
                thumbnailUrl: thumbnailUrl
            };
        });

        res.json(videos);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
