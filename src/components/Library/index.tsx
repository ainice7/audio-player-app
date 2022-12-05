import { useState } from "react";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import LibraryListItem from "./components/ListItem";

import Track from "types/Track";

type LibraryProps = {
  tracks: Track[];
  onSetTrack: (value: number) => void;
};

const Library = ({ tracks, onSetTrack }: LibraryProps) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <aside className={`library ${isOpened ? "library--open" : ""}`}>
      <div className="library__title">
        <h2>Library</h2>
        <button className="library__btn" onClick={() => setIsOpened(!isOpened)}>
          <MenuOpenIcon fontSize="large" />
        </button>
      </div>
      <ul className="library__list">
        {tracks.map((track, index) => {
          return (
            <LibraryListItem
              {...track}
              onClick={() => onSetTrack(index)}
              key={track.id}
            />
          );
        })}
      </ul>
    </aside>
  );
};

export default Library;
