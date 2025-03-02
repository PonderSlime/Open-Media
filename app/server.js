const express = require('express');
const fs = require('fs');
const path = require('path');
var mm = require('musicmetadata');
const app = express();
const port = 3001;

// _______  __    __  .__   __.   ______ .___________. __    ______   .__   __.      _______.
//|   ____||  |  |  | |  \ |  |  /      ||           ||  |  /  __  \  |  \ |  |     /       |
//|  |__   |  |  |  | |   \|  | |  ,----'`---|  |----`|  | |  |  |  | |   \|  |    |   (----`
//|   __|  |  |  |  | |  . `  | |  |         |  |     |  | |  |  |  | |  . `  |     \   \    
//|  |     |  `--'  | |  |\   | |  `----.    |  |     |  | |  `--'  | |  |\   | .----)   |   
//|__|      \______/  |__| \__|  \______|    |__|     |__|  \______/  |__| \__| |_______/    
                                                                                           
function getMetadata(filePath, fileName) {
    return new Promise((resolve, reject) => {
      const readableStream = fs.createReadStream(filePath);
        mm(readableStream, (err, metadata) => {
            readableStream.close();
            if (err) {
                resolve({ file: fileName, error: err.message });
            } else {
                resolve({
                    file: fileName,
                    title: metadata.title || 'Unknown Title',
                    artist: metadata.artist || 'Unknown Artist',
                    album: metadata.album || 'Unknown Album',
                    genre: metadata.genre || 'Unknown Genre',
                    year: metadata.year || 'Unknown Year',
                });
            }
        });
    });
}
async function update_md() {
    const musicFolder = '/home/micah/Music';
    const allowedExtensions = ['.mp3', '.mp4', '.ogg', '.flac', '.wma', '.wmv', '.m4a', '.wav'];

    function getAllFiles(dirPath, arrayOfFiles) {
        const files = fs.readdirSync(dirPath);
        arrayOfFiles = arrayOfFiles || [];

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
            } else {
                const fileExtension = path.extname(filePath).toLowerCase();
                if (allowedExtensions.includes(fileExtension)) {
                    arrayOfFiles.push(filePath);
                }
            }
        });

        return arrayOfFiles;
    }
    const files = getAllFiles(musicFolder);
    console.log("files: ", files)
    
    const metadataPromises = files.map(filePath => {
        const fileName = path.join(filePath);
        return getMetadata(filePath, fileName);
    });
    const metadataList = await Promise.all(metadataPromises);
    console.log("Final metadata list: ", metadataList);

    const outputFilePath = path.join(__dirname, 'data', 'metadataList.json');
    fs.writeFile(outputFilePath, JSON.stringify(metadataList, null, 2), (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
    });
}

update_md();

//.______        ______    __    __  .___________. _______     _______.
//|   _  \      /  __  \  |  |  |  | |           ||   ____|   /       |
//|  |_)  |    |  |  |  | |  |  |  | `---|  |----`|  |__     |   (----`
//|      /     |  |  |  | |  |  |  |     |  |     |   __|     \   \    
//|  |\  \----.|  `--'  | |  `--'  |     |  |     |  |____.----)   |   
//| _| `._____| \______/   \______/      |__|     |_______|_______/    
                                                                     
app.get('/', (req, res) => {
    res.send('Welcome to the Music API');
});

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

app.get('/api/artists', (req, res) => {
    const artistsFilePath = path.join(__dirname, 'data', 'artists.json');
    const metadataFilePath = path.join(__dirname, 'data', 'metadataList.json');
    
    try {
        const metadataData = fs.readFileSync(metadataFilePath, 'utf8');
        const metadataList = JSON.parse(metadataData);

        const artistsMap = {};

        metadataList.forEach(metadata => {
            const artistName = metadata.artist || 'Unknown Artist';
            const songName = metadata.title || 'Unknown Title';

            if (!artistsMap[artistName]) {
                artistsMap[artistName] = { name: artistName, songs: [] };
            }

            artistsMap[artistName].songs.push({ song: songName });
        });

        const artistsList = Object.values(artistsMap);

        fs.writeFileSync(artistsFilePath, JSON.stringify(artistsList, null, 2), 'utf8');

        res.json(artistsList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});