import React, { useEffect, useState } from "react";

const Spotify = ({ children, onSearchResults }) => {
  const CLIENT_ID = "aa64dcd2e3bf4685b8bc01fb22861cc4";
  const REDIRECT_URI = "http://localhost:3000/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"; // Note: Use HTTPS
  const RESPONSE_TYPE = "token";
  const SCOPE = "playlist-modify-public"; // Added scopes
  const TOKEN_EXPIRY_TIME = 3600 * 1000; // Spotify tokens expire in 1 hour (3600 seconds)

  const [token, setToken] = useState("");
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);

    if (token) {
      fetchUserProfile(token);

      // Set a timeout to expire the token after the defined expiry time
      const tokenTimeout = setTimeout(() => {
        setToken("");
        window.localStorage.removeItem("token");
        setIsTokenExpired(true);
      }, TOKEN_EXPIRY_TIME);

      // Clear timeout on cleanup
      return () => clearTimeout(tokenTimeout);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (jsonResponse) {
          const { display_name, id } = jsonResponse;
          setProfile({
            name: display_name,
            id: id,
          });
        }
      })
      .catch((error) =>
        console.error("Error fetching user profile from Spotify API", error)
      );
  };

  // Search tracks api call
  const search = (term) => {
    fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const results = data.tracks.items.map((track) => ({
          id: track.id,
          trackUrl: track.external_urls.spotify,
          image:
            track.album.images[0]?.url ||
            track.album.images[1]?.url ||
            track.album.images[2]?.url,
          name: track.name,
          artist: track.artists[0].name,
          artistUrl: track.artists[0].external_urls.spotify,
          album: track.album.name,
          albumUrl: track.album.external_urls.spotify,
          uri: track.uri,
          previewUrl: track.preview_url,
        }));

        onSearchResults(results);
      })
      .catch((error) =>
        console.error("Error fetching track data from Spotify API", error)
      );
  };

  // Save to playlist to user's profile
  const savePlaylist = (playlistName, trackUris) => {
    if (!playlistName || !trackUris.length) {
        return Promise.resolve(); // Ensure it returns a promise
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    return fetch(`https://api.spotify.com/v1/users/${profile.id}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: playlistName }),
    })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({ uris: trackUris }),
                }
            ).then(() => jsonResponse); // Return the playlist response
        })
        .catch((error) => {
            console.error("Error saving playlist to Spotify", error);
            return Promise.reject(error); // Return a rejected promise on error
        });
};

  return (
    <div>
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`}
        >
          <div className="LogIn">
            <h1>Login to Spotify</h1>
          </div>
        </a>
      ) : (
        <div className="LoggedInMessage">
          <h2>
            Hello {profile ? profile.name : "User"}! You are logged in to
            Spotify
          </h2>
        </div>
      )}
      {isTokenExpired && (
        <div className="Popup">
          <p>Your session has expired. Please log back in.</p>
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`}
          >
            Log back in to Spotify?
          </a>
        </div>
      )}
      {typeof children === "function" &&
        token &&
        children(search, savePlaylist)}
    </div>
  );
};

export default Spotify;