const fs = require('fs');
const path = require('path');
const update_md = require('@/lib/update_md');

export async function GET() {
    const metadataFilePath = path.join('data/metadataList.json');
    const albumsFilePath = path.join('data/albums.json');

    try {
        const metadataData = fs.readFileSync(metadataFilePath, 'utf8');
        const metadataList = JSON.parse(metadataData);
        

        const albumsMap = {};

        metadataList.forEach(metadata => {
            const albumName = metadata.album || 'Unknown Album';
            const songName = metadata.title || 'Unknown Title';
            const fileName = metadata.file;
            const imageData = metadata.image;

            if (!albumsMap[albumName]) {
                albumsMap[albumName] = { name: albumName, songs: [] };
            }

            albumsMap[albumName].songs.push({ song: songName, file: fileName, image: imageData });
        });

        const albumsList = Object.values(albumsMap);

        fs.writeFileSync(albumsFilePath, JSON.stringify(albumsList, null, 2), 'utf8');

        return new Response(JSON.stringify(albumsList), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    update_md();
};