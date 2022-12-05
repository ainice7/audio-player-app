import { useState, useMemo } from "react";

import Player from "components/Player";
import Library from "components/Library";

import getData from "data";

function App() {
  const tracks = useMemo(() => getData(), []);
  const [trackIndex, setTrackIndex] = useState(0);

  const onSetTrack = (value: number) => {
    tracks[trackIndex].active = false;
    tracks[value].active = true;
    setTrackIndex(value);
  };

  return (
    <main className="player-app">
      <Library tracks={tracks} onSetTrack={onSetTrack} />
      <Player tracks={tracks} trackIndex={trackIndex} onSetTrack={onSetTrack} />
    </main>
  );
}

export default App;
