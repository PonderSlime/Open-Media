import React from 'react';

interface PlaylistItemProps {
  albumName: string;
  songs: { song: string; file: string }[];
  route: string;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ albumName, songs, route }) => {
  return (
    <div>
      {/*<a href={`playlists/${albumName}`} className='text-xl text-white'>{albumName}</a>*/}
      <ul>
        {songs.map((song, index) => (
          <li className='text-sm' key={index}>
            {song.song} - <a href={song.file} download>{song.file}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistItem;