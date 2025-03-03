const fs = require('fs');
const path = require('path');
const update_md = require('@/lib/update_md');

export async function GET() {
    const metadataFilePath = path.join('data/metadataList.json');
    const genresFilePath = path.join('data/genres.json');

    try {
        const metadataData = fs.readFileSync(metadataFilePath, 'utf8');
        const metadataList = JSON.parse(metadataData);
        

        const genresMap = {};

        metadataList.forEach(metadata => {
            const genres = metadata.genre || ['Unknown Genre'];
            const songName = metadata.title || 'Unknown Title';
            const fileName = metadata.file;
            const imageData = metadata.image;

            genres.forEach(genre => {
                if (!genresMap[genre]) {
                    genresMap[genre] = { name: genre, songs: [] };
                }

                // Use a Set to ensure unique songs
                const songSet = new Set(genresMap[genre].songs.map(song => song.song));
                if (!songSet.has(songName)) {
                    genresMap[genre].songs.push({ song: songName, file: fileName, image: imageData });
                }
            });
        });

        const genresList = Object.values(genresMap);

        fs.writeFileSync(genresFilePath, JSON.stringify(genresList, null, 2), 'utf8');

        return new Response(JSON.stringify(genresList), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    update_md();
};