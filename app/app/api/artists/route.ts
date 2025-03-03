const fs = require('fs');
const path = require('path');
const update_md = require('@/lib/update_md');

export async function GET() {
    const artistsFilePath = path.join('data/artists.json');
    const metadataFilePath = path.join('data/metadataList.json');
    
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

        return new Response(JSON.stringify(artistsList), {
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