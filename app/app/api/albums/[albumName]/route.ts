import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, context: { params: { albumName: string } }) {
  const params = await context.params; // ✅ Await params explicitly
  const albumName = decodeURIComponent(params.albumName); // ✅ No need for await

  const albumsFilePath = path.join(process.cwd(), 'data/albums.json');

  try {
    const albumsData = fs.readFileSync(albumsFilePath, 'utf8');
    const albums = JSON.parse(albumsData);

    const album = albums.find((a: { name: string }) => a.name === albumName);

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json(album, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
