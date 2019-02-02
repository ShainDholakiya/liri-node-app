require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require('fs');
var command = process.argv[2];

if (command === "concert-this") {
  findConcert();
}
else if (command === "spotify-this-song") {
  findSpotify();
}
else if (command === "movie-this") {
  findMovie();
}
else if (command === "do-what-it-says") {
  findRandom();
}
else {
  console.log("Command not found");
}

function findConcert() {
  var artist = process.argv.slice(3).join(" ");
  axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log("Name of the venue: " + response.data[i].venue.name);
        if (response.data[i].venue.region !== "") {
          console.log("Venue location: " + response.data[i].venue.city + ", " +
            response.data[i].venue.region + ", " + response.data[i].venue.country);
        }
        else {
          console.log("Venue location: " + response.data[i].venue.city + ", " +
            response.data[i].venue.country);
        }
        console.log("Date of the Event: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("--------------------------------------------");
      }
    });
}

function findSpotify() {
  var songName = process.argv.slice(3).join(" ");

  if (!songName) {
    spotify.search({
      type: "track",
      query: "The Sign",
      limit: 10
    }).then(function (response) {
      console.log("--------------------------------------------");
      console.log("Artist(s): " + response.tracks.items[9].album.artists[0].name);
      console.log("Track: " + response.tracks.items[9].name);
      console.log("Preview Song link: " + response.tracks.items[9].preview_url);
      console.log("Album: " + response.tracks.items[9].album.name);
      console.log("--------------------------------------------");
    });
  }
  else {
    spotify.search({
      type: "track",
      query: songName,
      limit: 1
    }).then(function (response) {
      console.log("--------------------------------------------");
      console.log(response.tracks);
      console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
      console.log("Track: " + response.tracks.items[0].name);
      console.log("Preview Song link: " + response.tracks.items[0].preview_url);
      console.log("Album: " + response.tracks.items[0].album.name);
      console.log("--------------------------------------------");
    });
  }
}