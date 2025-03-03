var mm = require('musicmetadata');
const fs = require('fs');
const path = require('path');

function getMetadata(filePath, fileName) {
    let newFileName = fileName.replace("public/", "/");
    return new Promise((resolve, reject) => {
        const readableStream = fs.createReadStream(filePath);
        mm(readableStream, (err, metadata) => {
            readableStream.close();
            if (err) {
                resolve({ file: newFileName, error: err.message });
            } else {
                let imagePath = null;
                if (metadata.picture.length > 0) {
                    const picture = metadata.picture[0];
                    const imageFileName = `${path.basename(filePath, path.extname(filePath))}.jpg`;
                    const imageFilePath = path.join('public/images', imageFileName);
                    fs.writeFileSync(imageFilePath, picture.data);
                    imagePath = `/images/${imageFileName}`;
                }
                resolve({
                    file: newFileName,
                    title: metadata.title || 'Unknown Title',
                    artist: metadata.artist || 'Unknown Artist',
                    album: metadata.album || 'Unknown Album',
                    genre: metadata.genre || 'Unknown Genre',
                    year: metadata.year || 'Unknown Year',
                    image: imagePath,
                });
            }
        });
    });
}

async function update_md() {
    const musicFolder = 'public/music';
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
    console.log("files: ", files);

    const metadataPromises = files.map(filePath => {
        const fileName = path.join(filePath); // Use relative path for public access
        return getMetadata(filePath, fileName);
    });

    const metadataList = await Promise.all(metadataPromises);
    console.log("Final metadata list: ", metadataList);

    const uniqueMetadata = Array.from(new Set(metadataList.map(JSON.stringify))).map(JSON.parse);

    const outputFilePath = path.join(process.cwd(), 'data', 'metadataList.json');
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(uniqueMetadata, null, 2), 'utf8');
        console.log(`Metadata successfully written to ${outputFilePath}`);
    } catch (err) {
        console.error(`Error writing metadata file: ${err.message}`);
    }
}

update_md();