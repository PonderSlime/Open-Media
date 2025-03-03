import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, context: { params: { artistName: string } }) {
  const params = await context.params;
  const decodedArtistName = decodeURIComponent(params.artistName);

  const artistsFilePath = path.join(process.cwd(), 'data/artists.json');

  try {
    const artistsData = fs.readFileSync(artistsFilePath, 'utf8');
    const artists = JSON.parse(artistsData);

    const artist = artists.find((a: { name: string | string[] }) => {
      if (Array.isArray(a.name)) {
        return a.name.includes(decodedArtistName);
      }
      return a.name === decodedArtistName;
    });

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json(artist, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}