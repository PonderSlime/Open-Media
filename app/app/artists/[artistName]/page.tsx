"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PlaylistItem from "@/components/SongListItem";
import MusicPlayer from "@/components/MusicPlayer";
interface Song {
  song: string;
  file: string;
}

interface Artist {
  name: string;
  songs: Song[];
}

const ArtistPage: React.FC = () => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const params = useParams();
  const artistName = params?.artistName as string; // Ensure it's a string
  
  useEffect(() => {
    if (artistName) {
      // Fetch the album data from the server
      fetch(`/api/artists/${encodeURIComponent(artistName)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            setArtist(data);
          }
        })
        .catch((error) => console.error("Error fetching album:", error));
    }
  }, [artistName]);

  if (!artist) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {/*<h1>{artist.name}</h1>*/}
      <MusicPlayer songs={artist.songs} album={artist.name}/>
    </div>
  );
  
};

export default ArtistPage;
