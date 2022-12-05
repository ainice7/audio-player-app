import {
  useMemo,
  ChangeEventHandler,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  MouseEvent,
} from "react";

import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

type VolumeButtonProps = {
  volume: number;
  isMuted: boolean;
  onScrub: ChangeEventHandler<HTMLInputElement>;
  onMuteClick: Dispatch<SetStateAction<boolean>>;
};

const VolumeButton = ({
  volume,
  isMuted,
  onScrub,
  onMuteClick,
}: VolumeButtonProps) => {
  const [isOpen, toggleController] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentPercentage = useMemo(
    () => (!isMuted ? `${volume * 100}%` : "0%"),
    [volume, isMuted]
  );
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;
  const currentIcon = useMemo(() => {
    if (isMuted) {
      return <VolumeOffIcon />;
    } else if (volume > 0 && volume < 0.5) {
      return <VolumeDownIcon />;
    } else if (volume > 0.5) {
      return <VolumeUpIcon />;
    } else {
      return <VolumeMuteIcon />;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        toggleController(false);
      }
    }

    // @ts-ignore
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // @ts-ignore
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="volume-controller" ref={ref}>
      {isOpen && (
        <div className="volume-controller__box">
          <input
            type="range"
            value={isMuted ? 0 : volume}
            step="0.01"
            min="0"
            max="1"
            onChange={onScrub}
            style={{ background: trackStyling }}
          />
          <button onClick={() => onMuteClick(!isMuted)}>{currentIcon}</button>
        </div>
      )}
      <button onClick={() => toggleController(!isOpen)}>{currentIcon}</button>
    </div>
  );
};

export default VolumeButton;
