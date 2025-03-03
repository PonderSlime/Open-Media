"use client"
import React, { useEffect, useState } from 'react';
import PlaylistItem from '@/components/PlaylistItem';

interface Artist {
  name: string;
  songs: { song: string; file: string }[];
}

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    // Fetch the albums data from the server
    fetch('/api/artists')
      .then(response => response.json())
      .then(data => setArtists(data))
      .catch(error => console.error('Error fetching artists:', error));
  }, []);

  return (
    <div>
      <h1>Artists</h1>
      {artists.length > 0 ? (
        artists.map((artist, index) => (
          <PlaylistItem key={index} albumName={artist.name} songs={artist.songs} route='artists'/>
        ))
      ) : (
        <p>List of artists will be displayed here.</p>
      )}
    </div>
  );
};

export default Artists;