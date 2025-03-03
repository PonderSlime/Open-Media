"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Use useParams instead of useRouter
import PlaylistItem from "@/components/SongListItem";

interface Song {
  song: string;
  file: string;
}

interface Genre {
  name: string;
  songs: Song[];
}

const GenrePage: React.FC = () => {
  const [genre, setGenre] = useState<Genre | null>(null);
  const params = useParams(); // ✅ Correctly fetch dynamic params
  const genreName = params?.genreName as string; // Ensure it's a string
  
  useEffect(() => {
    if (genreName) {
      // Fetch the album data from the server
      fetch(`/api/genres/${encodeURIComponent(genreName)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            setGenre(data);
          }
        })
        .catch((error) => console.error("Error fetching album:", error));
    }
  }, [genreName]);

  if (!genre) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{genre.name}</h1>
      <PlaylistItem albumName={genre.name} songs={genre.songs} route="songs" />
    </div>
  );
};

export default GenrePage;
