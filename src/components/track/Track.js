import React from "react";
import {
  FaMinusCircle,
  FaPlusCircle,
} from "react-icons/fa";
import "./Track.css";

const Track = (props) => {
  // Handle adding a track
  const addTrack = () => {
    props.onAdd(props.track);
  };

  // Handle removing a track
  const removeTrack = () => {
    props.onRemove(props.track);
  };

  // Handle add or remove shown based on state
  const addOrRemove = () => {
    if (props.isRemoval) {
      return (
        <button
          className="AddOrRemoveTrack"
          onClick={removeTrack}
        >
          <FaMinusCircle title="Remove From Playlist" />
        </button>
      );
    }
    return (
      <button
        className="AddOrRemoveTrack"
        onClick={addTrack}
      >
        <FaPlusCircle title="Add To Playlist" />
      </button>
    );
  };

  // Extract track info
  const trackName = props.track.name || "Unknown Name";
  const trackUrl = props.track.trackUrl || "Unknown URL";

  // Extract artist info
  const artistNames = props.track.artist || "Unknown Name";
  const artistUrl = props.track.artistUrl || "Unknown URL";

  // Extract album info
  const albumName = props.track.album || "Unknown Name";
  const albumUrl = props.track.albumUrl || "Unknown URL";
  const albumArt = props.track.image || "No Image";

  return (
    <div className="Track">
        <div className="TrackImg">
        {albumArt && (
          <img
            src={albumArt}
            alt="Album Art"
          />
          
        )}</div>
        <div className="TrackInfo">
        <h3>
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {trackName}
          </a>
        </h3>
        <h4>
          <a
            href={artistUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {artistNames}
          </a>
        </h4>
        <p>
          <a
            href={albumUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {albumName}
          </a>
        </p>
      </div>
      {addOrRemove()}
    </div>
  );
};

export default Track;
