import React, { useEffect, useState } from "react";
import "./TrackList.css";

import Track from "../track/Track";

const TrackList = (props) => {
  const [fade, setFade] = useState([]);

  // Set initial fade-in class for tracks when they are first loaded
  useEffect(() => {
    setFade(
      props.tracks.map((track) => ({
        ...track,
        className: "FadeIn",
      }))
    );
  }, [props.tracks]);

  // Handle adding a track with fade-out animation
  const handleAdd = (track) => {
    setFade((prevTracks) =>
      prevTracks.map((t) =>
        t.id === track.id ? { ...t, className: "FadeOut" } : t
      )
    );

    setTimeout(() => {
      props.onAdd(track); // Call the onAdd prop after the fade-out animation
    }, 350);
  };

  // Handle removing a track with fade-out animation
  const handleRemove = (track) => {
    setFade((prevTracks) =>
      prevTracks.map((t) =>
        t.id === track.id ? { ...t, className: "FadeOut" } : t
      )
    );

    setTimeout(() => {
      props.onRemove(track); // Call the onRemove prop after the fade-out animation
    }, 350);
  };

  return (
    <div className="TrackList">
      {fade.map((track) => (
        <div
          key={track.id}
          className={`Track ${track.className}`}
        >
          <Track
            track={track}
            onAdd={handleAdd}
            isRemoval={props.isRemoval}
            onRemove={handleRemove}
          />
        </div>
      ))}
    </div>
  );
};

export default TrackList;