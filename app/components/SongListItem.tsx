import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

interface Song {
  song: string;
  file: string;
  image?: string;
}

interface PlaylistItemProps {
  albumName: string;
  songs: Song[];
  route: string;
  setCurrentSong: (index: number) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ albumName, songs, route, setCurrentSong }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{albumName}</h2>
      <ul>
        {songs.map((song, index) => (
          <li
            className="flex items-center mb-2 cursor-pointer"
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setCurrentSong(index)}
          >
            <span className="text-sm font-medium mr-4">
              {hoveredIndex === index ? (
                <FontAwesomeIcon icon={faPlay} />
              ) : (
                index + 1
              )}
            </span>
            {song.image && (
              <img src={song.image} alt="Album Art" className="w-12 h-12 object-cover mr-4" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{song.song}</span>
              <a href={song.file} download className="text-xs text-gray-400">{song.file}</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistItem;