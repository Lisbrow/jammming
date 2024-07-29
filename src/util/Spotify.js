import React, { useEffect, useState } from "react";

const Spotify = ({ children, onSearchResults }) => {
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "playlist-read-private playlist-modify-public playlist-modify-private user-read-private user-read-email";

  const [accessToken, setAccessToken] = useState("");
  const [isTokenExpired, setIsTokenExpired] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // Token authorization
    if (!token && hash) {
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        token = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);

        window.localStorage.setItem("token", token);
        setAccessToken(token);

        window.setTimeout(() => {
          setAccessToken("");
          window.localStorage.removeItem("token");
          setIsTokenExpired(true);
        }, expiresIn * 1000);

        window.history.pushState("Access Token", null, "/");
      }
    } else if (token) {
      setAccessToken(token);
    }

    if (token && profile.id) {
      fetchUserProfile(token);
    }
  }, [profile.id]);

  // Fetch user profile from Spotify
  const fetchUserProfile = (accessToken) => {
    fetch(`https://api.spotify.com/v1/users/${profile.id}/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => response.json())
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

  // Search tracks using Spotify API
  const search = (term) => {
    fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
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
          uri: track.uri
        }));

        onSearchResults(results);
      })
      .catch((error) =>
        console.error("Error fetching track data from Spotify API", error)
      );
  };

  // Save to playlist to user's Spotify profile
  const savePlaylist = (playlistName, trackUris) => {
    if (!playlistName || !trackUris.length) {
      return Promise.resolve();
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
    let userId;

    return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Saving Playlist Failed!');
            })
            .then(jsonResponse => {
                userId = jsonResponse.id;

    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: headers,
      method: "POST",
      body: JSON.stringify({ name: playlistName }),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        const playlistId = jsonResponse.id;
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
            method: "POST",
            body: JSON.stringify({ uris: trackUris }),
          }
        ).then(() => jsonResponse);
      })
      .catch((error) => {
        console.error("Error saving playlist to Spotify", error);
        return Promise.reject(error);
      });
    });
  };

  return (
    <div>
      {!accessToken ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`}
        >
          <div className="LogIn">
            <h1>Login to Spotify</h1>
          </div>
        </a>
      ) : (
        <div className="LoggedInMessage">
          <h2>
            {profile && profile.name ? (`Hello ${profile.name}! You are logged into Spotify`) : `You are logged in to Spotify`}
          </h2>
        </div>
      )}
      {isTokenExpired && (
        <div className="Popup">
          <p>Your session has expired. Please log back in.</p>
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`}
          >
            Log back in to Spotify?
          </a>
        </div>
      )}
      {typeof children === "function" &&
        accessToken &&
        children(search, savePlaylist)}
    </div>
  );
};

export default Spotify;