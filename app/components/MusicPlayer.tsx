import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faRandom, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import PlaylistItem from '@/components/SongListItem'; // Import the PlaylistItem component

interface Song {
  song: string;
  file: string;
  image?: string;
}

interface MusicPlayerProps {
  songs: Song[];
  album: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ songs, album }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState<Song[]>([]);
  const [playedSongs, setPlayedSongs] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    shuffleSongs();
  }, [songs]);

  const shuffleSongs = () => {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setShuffledSongs(shuffled);
    setPlayedSongs([]);
    setCurrentSongIndex(0);
  };

  const playPauseHandler = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    if (isShuffle) {
      if (playedSongs.length === shuffledSongs.length - 1) {
        shuffleSongs();
      } else {
        setPlayedSongs([...playedSongs, shuffledSongs[currentSongIndex]]);
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % shuffledSongs.length);
      }
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    }
    setIsPlaying(true);
  };

  const prevSongHandler = () => {
    if (isShuffle) {
      if (playedSongs.length > 0) {
        const lastPlayedSong = playedSongs.pop();
        setPlayedSongs([...playedSongs]);
        setCurrentSongIndex(shuffledSongs.indexOf(lastPlayedSong!));
      } else {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + shuffledSongs.length) % shuffledSongs.length);
      }
    } else {
      setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
    }
    setIsPlaying(true);
  };

  const handleAudioError = () => {
    console.error(`Error loading audio file: ${isShuffle ? shuffledSongs[currentSongIndex].file : songs[currentSongIndex].file}`);
    // Optionally, you can skip to the next song if there's an error
    nextSongHandler();
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      shuffleSongs();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const setCurrentSong = (index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    audioRef.current?.play();
  };

  useEffect(() => {
    console.log(`Current song file path: ${isShuffle ? shuffledSongs[currentSongIndex]?.file : songs[currentSongIndex]?.file}`);
  }, [currentSongIndex, isShuffle]);

  const currentSong = isShuffle ? shuffledSongs[currentSongIndex] : songs[currentSongIndex];

  return (
    <div>
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gray-900 text-white shadow-md" style={{ marginLeft: '70px' }}>
        <audio
          ref={audioRef}
          src={currentSong?.file}
          onEnded={nextSongHandler}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={handleAudioError}
          onTimeUpdate={handleTimeUpdate}
          autoPlay
        />
        <div className="flex items-center">
          {currentSong?.image && (
            <img src={currentSong.image} alt="Album Art" className="w-16 h-16 object-cover mr-4" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{currentSong?.song}</span>
            <span className="text-xs text-gray-400">{currentSong?.artist}</span>
          </div>
        </div>
        <div className="flex flex-col items-center flex-grow mx-4">
          <div className="flex gap-4 mb-2">
            <button onClick={prevSongHandler} className="text-xl">
              <FontAwesomeIcon icon={faStepBackward} />
            </button>
            <button onClick={playPauseHandler} className="text-2xl">
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <button onClick={nextSongHandler} className="text-xl">
              <FontAwesomeIcon icon={faStepForward} />
            </button>
            <button onClick={toggleShuffle} className={`text-xl ${isShuffle ? 'text-green-500' : ''}`}>
              <FontAwesomeIcon icon={faRandom} />
            </button>
          </div>
          <div className="w-full flex items-center">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faVolumeUp} className="text-xl mr-2" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
      <PlaylistItem albumName={album} songs={songs} route="/" setCurrentSong={setCurrentSong} />
    </div>
  );
};

export default MusicPlayer;