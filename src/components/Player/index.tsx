import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";

import Controls from "./components/Controls";
import Scrubber from "./components/Scrubber";
import VolumeButton from "./components/VolumeButton";

import usePrevious from "hooks/usePrevious";

import Track from "types/Track";

type AudioPlayerProps = {
  tracks: Track[];
  trackIndex: number;
  onSetTrack: (value: number) => void;
};

enum ScrubEnum {
  volume = "volume",
  duration = "duration",
}

const AudioPlayer = ({ tracks, trackIndex, onSetTrack }: AudioPlayerProps) => {
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setReady] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setMuted] = useState(false);
  const prevIndex = usePrevious(trackIndex);

  const { name, artist, color, cover, audio } = tracks[trackIndex];

  // Refs
  const audioRef = useRef(new Audio(audio));
  const intervalRef = useRef(0);

  // Destructure for conciseness
  const { duration } = audioRef.current;

  const setAudioTime = (value: number) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const toNextTrack = useCallback(() => {
    if (trackIndex < tracks.length - 1) {
      onSetTrack(trackIndex + 1);
    } else {
      onSetTrack(0);
    }
    setReady(true);
  }, [trackIndex, tracks.length]);

  const startTimer = useCallback(() => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  }, [intervalRef, toNextTrack]);

  const toPrevTrack = () => {
    if (audioRef.current.currentTime > 5) {
      setAudioTime(0);
      startTimer();
    } else {
      if (trackIndex - 1 < 0) {
        onSetTrack(tracks.length - 1);
      } else {
        onSetTrack(trackIndex - 1);
      }
    }
    setReady(true);
  };

  const onScrub = useCallback((e: ChangeEvent, type: ScrubEnum) => {
    const { value } = e.target as HTMLInputElement;

    if (type === ScrubEnum.duration) {
      setIsPlaying(false);
      setAudioTime(+value);
    } else {
      if (isMuted) setMuted(false);
      setVolume(+value);
    }
  }, []);

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, startTimer]);

  useEffect(() => {
    const audio = audioRef.current;
    const interval = intervalRef.current;
    // Pause and clean up on unmount
    return () => {
      audio.pause();
      clearInterval(interval);
    };
  }, []);

  // Handle setup when changing tracks
  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audio);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    }
  }, [trackIndex, audio, startTimer, isReady]);

  useEffect(() => {
    if (Number.isFinite(prevIndex) && prevIndex !== trackIndex) {
      setReady(true);
    }
  }, [trackIndex, prevIndex]);

  useEffect(() => {
    audioRef.current.muted = isMuted;
  }, [isMuted, trackIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume, trackIndex]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", color[0]);
    document.documentElement.style.setProperty("--secondary-color", color[1]);
  }, [trackIndex, color]);

  return (
    <div className={`audio-player ${isPlaying ? "audio-player--playing" : ""}`}>
      <div className="audio-player__track-info">
        <img
          className="audio-player__artwork"
          src={cover}
          alt={`${name} track cover`}
        />
        <h2 className="audio-player__title">{name}</h2>
        <h3 className="audio-player__artist">{artist}</h3>
        <Scrubber
          trackProgress={trackProgress}
          duration={duration}
          onScrub={(e) => onScrub(e, ScrubEnum.duration)}
          onScrubEnd={onScrubEnd}
        />
        <Controls
          isPlaying={isPlaying}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          onPlayPauseClick={setIsPlaying}
        >
          <VolumeButton
            volume={volume}
            isMuted={isMuted}
            onMuteClick={setMuted}
            onScrub={(e) => onScrub(e, ScrubEnum.volume)}
          />
        </Controls>
      </div>
    </div>
  );
};

export default AudioPlayer;
