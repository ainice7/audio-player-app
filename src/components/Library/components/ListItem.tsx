import { MouseEventHandler } from "react";

import Track from "types/Track";

type ListItemProps = {
  onClick: MouseEventHandler<HTMLLIElement>;
} & Track;

const ListItem = ({ cover, name, artist, active, onClick }: ListItemProps) => {
  return (
    <li
      className={`library-item ${active ? "library-item--active" : ""}`}
      onClick={onClick}
    >
      <img
        className="library-item__cover"
        src={cover}
        alt={`${name} track cover`}
      />
      <div className="library-item__info">
        <h4 className="truncate">{name}</h4>
        <h5 className="truncate">{artist}</h5>
      </div>
    </li>
  );
};

export default ListItem;
