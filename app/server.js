const express = require('express');
const fs = require('fs');
const path = require('path');
var mm = require('musicmetadata');
const app = express();
const port = 3001;
// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Music API');
});

app.get('/api/artists', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'artists.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const artists = JSON.parse(data);
    res.json(artists);
  });
});


async function save_md() {
    const musicFolder = '/home/micah/Music'; // Update this path to your music folder
    const files = fs.readdirSync(musicFolder);
    console.log("files: ", files)
    var metadataList = [];

    for (const file of files) {
        const filePath = path.join(musicFolder, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            try {
                var readableStream = fs.createReadStream(filePath);
                var parser = mm(readableStream, function (err, metadata) {
                    console.log(metadata);
                    metadataList.push({
                        file: file,
                        title: metadata.title,
                        artist: metadata.artist,
                        album: metadata.album,
                        genre: metadata.genre,
                        year: metadata.year,
                    });
                    console.log("metadata list: ", metadataList);
                    readableStream.close();
                });                
            } catch (err) {
                console.error(`Error reading metadata for file ${file}:`, err.message);
                metadataList.push({
                file: file,
                error: err.message
                });
            }
        }
    };
    console.log("metadata list (check if still exists): ", metadataList);
    const outputFilePath = path.join(__dirname, 'data', 'metadataList.json');
    fs.writeFile(outputFilePath, JSON.stringify(metadataList, null, 2), (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });
}

app.get('/api/music-metadata', async (req, res) => {
    const filePath = path.join(__dirname, 'data', 'metadataList.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(JSON.parse(data));
      });
});
save_md();
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});