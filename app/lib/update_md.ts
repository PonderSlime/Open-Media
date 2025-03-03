var mm = require('musicmetadata');
const fs = require('fs');
const path = require('path');

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
            return new Response(JSON.stringify({ error: err }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            return;
        }
    });
}