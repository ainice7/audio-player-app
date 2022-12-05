import { useMemo, ChangeEventHandler } from "react";

type ScrubberProps = {
  trackProgress: number;
  duration: number;
  onScrub: ChangeEventHandler<HTMLInputElement>;
  onScrubEnd: () => void;
};

const Scrubber = ({
  trackProgress,
  duration,
  onScrub,
  onScrubEnd,
}: ScrubberProps) => {
  const currentPercentage = useMemo(
    () => (duration ? `${(trackProgress / duration) * 100}%` : "0%"),
    [duration, trackProgress]
  );
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  return (
    <input
      type="range"
      value={trackProgress}
      step="1"
      min="0"
      max={duration ? duration : `${duration}`}
      className="progress"
      onChange={onScrub}
      onMouseUp={onScrubEnd}
      onKeyUp={onScrubEnd}
      style={{ background: trackStyling }}
    />
  );
};

export default Scrubber;
