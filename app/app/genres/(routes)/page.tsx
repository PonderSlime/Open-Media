"use client"
import React, { useEffect, useState } from 'react';
import PlaylistItem from '@/components/PlaylistItem';

interface Genre {
  name: string;
  songs: { song: string; file: string }[];
}

const Playlists: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    // Fetch the albums data from the server
    fetch('/api/genres')
      .then(response => response.json())
      .then(data => setGenres(data))
      .catch(error => console.error('Error fetching genre:', error));
  }, []);

  return (
    <div>
      <h1>Playlists</h1>
      {genres.length > 0 ? (
        genres.map((genres, index) => (
          <PlaylistItem key={index} albumName={genres.name} songs={genres.songs} route="genres" />
        ))
      ) : (
        <p>List of playlists will be displayed here.</p>
      )}
    </div>
  );
};

export default Playlists;