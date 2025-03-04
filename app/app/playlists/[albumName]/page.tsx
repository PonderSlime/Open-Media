"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Use useParams instead of useRouter
import PlaylistItem from "@/components/SongListItem";
import MusicPlayer from "@/components/MusicPlayer";
interface Song {
  song: string;
  file: string;
}

interface Album {
  name: string;
  songs: Song[];
}

const AlbumPage: React.FC = () => {
  const [album, setAlbum] = useState<Album | null>(null);
  const params = useParams(); // ✅ Correctly fetch dynamic params
  const albumName = params?.albumName as string; // Ensure it's a string
  
  useEffect(() => {
    if (albumName) {
      // Fetch the album data from the server
      fetch(`/api/albums/${encodeURIComponent(albumName)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            console.error(data.error);
          } else {
            setAlbum(data);
          }
        })
        .catch((error) => console.error("Error fetching album:", error));
    }
  }, [albumName]);

  if (!album) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {/*<h1>{album.name}</h1>*/}
      <MusicPlayer songs={album.songs} album={album.name}/>
    </div>
  );
};

export default AlbumPage;
