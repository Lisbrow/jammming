# Jammming

Jammming is a React web application that allows users to search the Spotify library, create a custom playlist, and save it to their Spotify account.

## Table of Contents
- [Jammming](#jammming)
  - [Table of Contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Future Work](#future-work)
  - [License](#license)
  - [Acknowledgements](#acknowledgements)

## Purpose
This project was developed as part of a React course to build a web application using React components, state management, and the Spotify API. The main objective was to provide a platform for users to search for songs, create custom playlists, and export these playlists to their Spotify accounts.

## Features
- Users can search for songs by song title, artist, or album.
- Users can see information about each song like title, artist, album, and album art with links to Spotify for each.
- Users can create a name for the playlist.
- Users can add and remove tracks from the playlist.
- Users can create and save the playlist to their Spotify account.

## Technologies
- React.js
- Spotify Web API (Implicit Grant Flow)
- JavaScript
- HTML
- CSS

## Getting Started

### Prerequisites
Before you begin, ensure you have the following:
- Node.js installed on your machine
- A Spotify Developer account

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Lisbrow/jammming.git
    cd jammming
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Spotify client ID and client secret:
    ```env
    REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
    REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
    ```

4. Start the development server:
    ```bash
    npm start
    ```

## Usage
1. Open your browser and navigate to `http://localhost:3000/`.
2. Click the "Login to Spotify" button to authenticate with your Spotify account.
3. Use the search bar to find tracks you want to add to your playlist.
4. Add tracks to your playlist by clicking the "+" button or remove tracks from your playlist by clicking the "-" button next to each track (visible upon hover).
5. Name your playlist by typing in the input field at the top.
6. Click "SAVE TO SPOTIFY" to save your playlist to your Spotify account.
7. Once the popup says the playlist has saved, click the "View on Spotify" link to be redirected to Spotify and see the newly created playlist on the user's account.

## Future Work
- Improve the user interface and user experience.
- Add song previews to each track with "play" and "pause/stop" buttons.
- Add personalized user experience by implementing a new component that will contain the user's existing playists.

## License
This project is licensed under the MIT License.

## Acknowledgements
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [React](https://reactjs.org/)
