import { Dispatch, SetStateAction } from "react";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import NextIcon from "@mui/icons-material/ArrowForwardIos";
import PrevIcon from "@mui/icons-material/ArrowBackIosNew";

type ControlsProps = {
  isPlaying: boolean;
  onPlayPauseClick: Dispatch<SetStateAction<boolean>>;
  onPrevClick: () => void;
  onNextClick: () => void;
} & { children: React.ReactNode };

const Controls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  children,
}: ControlsProps) => (
  <div className="audio-controls">
    <button
      type="button"
      className="prev"
      aria-label="Previous"
      onClick={onPrevClick}
    >
      <PrevIcon />
    </button>
    {isPlaying ? (
      <button
        type="button"
        className="pause"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        <PauseIcon />
      </button>
    ) : (
      <button
        type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
      >
        <PlayIcon />
      </button>
    )}
    <button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
    >
      <NextIcon />
    </button>
    {children}
  </div>
);

export default Controls;
