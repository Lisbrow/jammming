import React, { useState, useCallback } from "react";
import { FaSpotify } from "react-icons/fa";
import "./App.css";

import Playlist from "../playlist/Playlist";
import SearchBar from "../searchbar/SearchBar";
import SearchResults from "../searchresults/SearchResults";
import Spotify from "../../util/Spotify";

const App = () => {
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");

  const addTrack = useCallback(
    (track) => {
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
      setSearchResults((prevResults) =>
        prevResults.filter((currentTrack) => currentTrack.id !== track.id)
      );
    },
    [playlistTracks]
  );

  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
    setSearchResults((prevResults) => [...prevResults, track]);
  }, []);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  const savePlaylist = useCallback(
    (SpotifySavePlaylist) => {
      setIsSaving(true);
      setShowPopup(true);
      const trackUris = playlistTracks.map((track) => track.uri);
      SpotifySavePlaylist(playlistName, trackUris).then((response) => {
        setPlaylistName("New Playlist");
        setPlaylistTracks([]);
        setPlaylistUrl(response.external_urls.spotify); // Set the playlist URL
        setIsSaving(false);
      });
    },
    [playlistName, playlistTracks]
  );

  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

  const clearSearchResults = () => {
    setSearchResults([]); // Clear search results
  };

  const closePopup = () => {
    setShowPopup(false); // Hide the popup
  };

  return (
    <div>
      <h1 className="Header">
        <FaSpotify className="Icon" /> Ja<span className="Highlight">mmm</span>
        ing
      </h1>
      <div className="App">
        <Spotify onSearchResults={handleSearchResults}>
          {(search, SpotifySavePlaylist) => (
            <div className="AppTracksAndPlaylist">
              <div className="AppTracks">
                <SearchBar
                  search={search}
                  clearSearchResults={clearSearchResults}
                />
                <div className="ScrollContainer">
                  <SearchResults
                    tracks={searchResults}
                    onAdd={addTrack}
                  />
                </div>
              </div>
              <div className="AppPlaylist">
                <Playlist
                  playlistName={playlistName}
                  playlistTracks={playlistTracks}
                  onNameChange={updatePlaylistName}
                  onRemove={removeTrack}
                  onSave={() => savePlaylist(SpotifySavePlaylist)}
                />
              </div>
            </div>
          )}
        </Spotify>
        {showPopup && (
          <div className="Popup">
            <div className="PopupButton">
            <button
              className="CloseButton"
              onClick={closePopup}
            >
              X
            </button></div>
            {isSaving ? (
              <p>Saving your playlist...</p>
            ) : (
              <div className="PlaylistSaved">
                <p>Playlist saved!</p>

                {playlistUrl && (
                  <a
                    href={playlistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Spotify
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;