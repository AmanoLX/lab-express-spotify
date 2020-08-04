require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

// Iteration 3 | Search for an Artist

// Step 1 | Create a Homepage

app.get('/', (req, res) => {
  res.render('index');
});

// Step 2 | Display results for artist search
app.get('/artist-search', (req, res, next) => {
  console.log(req.params)
  spotifyApi
      .searchArtists(req.query.artist)
      .then(data => {
          console.log('The received data from the API: ', data.body);
          res.render('artist-search-results', {artists: data.body.artists.items})
      })
      .catch(err => console.log('The error while searching artists occurred: ', err));
});

// Iteration 4 | View Albums
app.get('/albums/:artistId', (req, res, next) => {
  console.log(req.params)
  spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then(data => {
          console.log(data.body.items);
          res.render('albums', {albums: data.body.items});
      })
      .catch(err => console.log('Error occurred while retrieving albums: ', err))
});

// Iteration 5 | View Tracks
app.get('/tracks/:albumId', (req, res) => {
  console.log(req.params);
  spotifyApi 
      .getAlbumTracks(req.params.albumId)
      .then((data) => {
          console.log(data.body)
          res.render('tracks', {tracks: data.body.items})
      })
      .catch(err => console.log('Error occurred while retrieving album tracks: ', err))
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
