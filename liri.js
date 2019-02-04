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
      console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
      console.log("Track: " + response.tracks.items[0].name);
      console.log("Preview Song link: " + response.tracks.items[0].preview_url);
      console.log("Album: " + response.tracks.items[0].album.name);
      console.log("--------------------------------------------");
    });
  }
}

function findMovie() {
  var movieName = process.argv.slice(3).join(" ");

  if (!movieName) {
    axios
      .get("http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=trilogy")
      .then(function (response) {
        console.log("--------------------------------------------");
        console.log("Title: " + response.data.Title);
        console.log("Year Released: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country/Countries Produced: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("--------------------------------------------");
      }
      );
  }
  else {
    axios
      .get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy")
      .then(function (response) {
        console.log("--------------------------------------------");
        console.log("Title: " + response.data.Title);
        console.log("Year Released: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country/Countries Produced: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("--------------------------------------------");
      }
      );
  }
}

function findRandom() {
  fs.readFile("./random.txt", "utf-8", function(err, response) {
    let splitData = response.split(",");
    var command = splitData[0];
    var info = splitData[1];

    if (command === "spotify-this-song") {
      spotify.search({
        type: "track",
        query: info,
        limit: 1
      }).then(function (response) {
        console.log("--------------------------------------------");
        console.log("Artist(s): " + response.tracks.items[0].album.artists[0].name);
        console.log("Track: " + response.tracks.items[0].name);
        console.log("Preview Song link: " + response.tracks.items[0].preview_url);
        console.log("Album: " + response.tracks.items[0].album.name);
        console.log("--------------------------------------------");
      });
    }
    else if (command === "movie-this") {
      axios
      .get("http://www.omdbapi.com/?t=" + info + "&y=&plot=short&apikey=trilogy")
      .then(function (response) {
        console.log("--------------------------------------------");
        console.log("Title: " + response.data.Title);
        console.log("Year Released: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
        console.log("Country/Countries Produced: " + response.data.Country);
        console.log("Language(s): " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("--------------------------------------------");
      }
      );
    }
    else if (command === "concert-this") {
      axios
      .get("https://rest.bandsintown.com/artists/" + info + "/events?app_id=codingbootcamp")
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
  });
}