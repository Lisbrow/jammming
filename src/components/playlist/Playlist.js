import React, { useCallback } from "react";
import "./Playlist.css";

import TrackList from "../tracklist/TrackList";

const Playlist = (props) => {
    const { onNameChange, onRemove, playlistTracks, onSave, playlistName } = props;

    // Handle playlist name change
    const handleNameChange = useCallback(
        (event) => {
            onNameChange(event.target.value);
        },
        [onNameChange]
    );

    return (
        <div className="Playlist">
            <input
                value={playlistName}
                onChange={handleNameChange}
                placeholder="New Playlist"
            />
            <div className="ScrollContainer">
                {playlistTracks.length === 0 ? (
                    <p>Playlist is empty, add some tracks!</p>
                ) : (
                    <div>
                        <TrackList
                            tracks={playlistTracks}
                            isRemoval={true}
                            onRemove={onRemove}
                        />
                        <button
                            className="PlaylistSave"
                            onClick={onSave}
                        >
                            SAVE TO SPOTIFY
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Playlist;