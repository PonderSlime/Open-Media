"use client"
import React, { useEffect, useState } from 'react';
import PlaylistItem from '@/components/PlaylistItem';

interface Album {
  name: string;
  songs: { song: string; file: string }[];
}

const Playlists: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    // Fetch the albums data from the server
    fetch('/api/albums')
      .then(response => response.json())
      .then(data => setAlbums(data))
      .catch(error => console.error('Error fetching albums:', error));
  }, []);

  return (
    <div>
      <h1>Playlists</h1>
      {albums.length > 0 ? (
        albums.map((album, index) => (
          <PlaylistItem key={index} albumName={album.name} songs={album.songs} route="playlists" />
        ))
      ) : (
        <p>List of playlists will be displayed here.</p>
      )}
    </div>
  );
};

export default Playlists;