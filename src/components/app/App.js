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

// Add track to playlist
  const addTrack = useCallback(
    (track) => {
      // Prevent adding duplicate tracks
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
      // Remove track from search results after adding to playlist
      setSearchResults((prevResults) =>
        prevResults.filter((currentTrack) => currentTrack.id !== track.id)
      );
    },
    [playlistTracks]
  );

  // Remove track from playlist
  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
    // Add track back to search results after removal
    setSearchResults((prevResults) => [...prevResults, track]);
  }, []);

  // Update playlist name
  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);

  // Save playlist to Spotify
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

  // Handle search results from Spotify
  const handleSearchResults = useCallback((results) => {
    setSearchResults(results);
  }, []);

// Clear search results
  const clearSearchResults = () => {
    setSearchResults([]); 
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false); 
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