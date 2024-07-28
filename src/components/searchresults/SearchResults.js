import React from "react";
import "./SearchResults.css";

import TrackList from "../tracklist/TrackList";

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <TrackList
        tracks={props.tracks}
        onAdd={props.onAdd}
      />
    </div>
  );
};

export default SearchResults;