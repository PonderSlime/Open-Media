import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, context: { params: { genreName: string } }) {
  const params = await context.params;
  const decodedGenreName = decodeURIComponent(params.genreName);

  const genresFilePath = path.join(process.cwd(), 'data/genres.json');

  try {
    const genresData = fs.readFileSync(genresFilePath, 'utf8');
    const genres = JSON.parse(genresData);

    const genre = genres.find((a: { name: string | string[] }) => {
      if (Array.isArray(a.name)) {
        return a.name.includes(decodedGenreName);
      }
      return a.name === decodedGenreName;
    });

    if (!genre) {
      return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
    }

    return NextResponse.json(genre, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}