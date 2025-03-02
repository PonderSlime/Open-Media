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

    const uniqueMetadata = Array.from(new Set(metadataList.map(JSON.stringify))).map(JSON.parse);

    const outputFilePath = path.join(__dirname, 'data', 'metadataList.json');
    fs.writeFile(outputFilePath, JSON.stringify(uniqueMetadata, null, 2), (err) => {
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

    await update_md();
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
            const fileName = metadata.file;

            if (!artistsMap[artistName]) {
                artistsMap[artistName] = { name: artistName, songs: [] };
            }

            // Use a Set to ensure unique songs
            const songSet = new Set(artistsMap[artistName].songs.map(song => song.song));
            if (!songSet.has(songName)) {
                artistsMap[artistName].songs.push({ song: songName, file: fileName });
            }
        });

        const artistsList = Object.values(artistsMap);

        fs.writeFileSync(artistsFilePath, JSON.stringify(artistsList, null, 2), 'utf8');

        res.json(artistsList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    update_md();

});

app.get('/api/albums', async (req, res) => {
    const metadataFilePath = path.join(__dirname, 'data', 'metadataList.json');
    const albumsFilePath = path.join(__dirname, 'data', 'albums.json');

    try {
        const metadataData = fs.readFileSync(metadataFilePath, 'utf8');
        const metadataList = JSON.parse(metadataData);
        const fileName = metadata.file;

        const albumsMap = {};

        metadataList.forEach(metadata => {
            const albumName = metadata.album || 'Unknown Album';
            const songName = metadata.title || 'Unknown Title';

            if (!albumsMap[albumName]) {
                albumsMap[albumName] = { name: albumName, songs: [] };
            }

            albumsMap[albumName].songs.push({ song: songName, file: fileName });
        });

        const albumsList = Object.values(albumsMap);

        fs.writeFileSync(albumsFilePath, JSON.stringify(albumsList, null, 2), 'utf8');

        res.json(albumsList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    update_md();
});

app.get('/api/genres', async (req, res) => {
    const metadataFilePath = path.join(__dirname, 'data', 'metadataList.json');
    const genresFilePath = path.join(__dirname, 'data', 'genres.json');

    try {
        const metadataData = fs.readFileSync(metadataFilePath, 'utf8');
        const metadataList = JSON.parse(metadataData);
        const fileName = metadata.file;

        const genresMap = {};

        metadataList.forEach(metadata => {
            const genres = metadata.genre || ['Unknown Genre'];
            const songName = metadata.title || 'Unknown Title';

            genres.forEach(genre => {
                if (!genresMap[genre]) {
                    genresMap[genre] = { name: genre, songs: [] };
                }

                // Use a Set to ensure unique songs
                const songSet = new Set(genresMap[genre].songs.map(song => song.song));
                if (!songSet.has(songName)) {
                    genresMap[genre].songs.push({ song: songName, file: fileName });
                }
            });
        });

        const genresList = Object.values(genresMap);

        fs.writeFileSync(genresFilePath, JSON.stringify(genresList, null, 2), 'utf8');

        res.json(genresList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    update_md();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});